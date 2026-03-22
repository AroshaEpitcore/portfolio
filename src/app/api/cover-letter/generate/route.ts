import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UserCoverLetterDocument } from "@/lib/cover-letter-pdf";
import type { CoverLetterFormData } from "@/lib/cover-letter-pdf";
import { FREE_GENERATIONS } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please create an account or log in to generate your cover letter." },
        { status: 401 }
      );
    }

    const coverLetterData: CoverLetterFormData = await request.json();

    // Upsert cv_user record (shared with CV generator)
    const { data: cvUser, error: upsertError } = await supabase
      .from("cv_users")
      .upsert(
        {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id", ignoreDuplicates: false }
      )
      .select()
      .single();

    // Resolve the user record for limit checking
    let resolvedUser = cvUser;
    if (upsertError || !resolvedUser) {
      const { data: existing } = await supabase
        .from("cv_users")
        .select()
        .eq("id", user.id)
        .single();
      if (!existing) {
        return NextResponse.json({ error: "Failed to get user record" }, { status: 500 });
      }
      resolvedUser = existing;
    }

    // Check cover letter generation limit
    const clUsed = resolvedUser.cl_generations_used ?? 0;
    if (clUsed >= FREE_GENERATIONS && !resolvedUser.is_paid) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", cl_generations_used: clUsed },
        { status: 402 }
      );
    }

    // Generate PDF
    const doc = createElement(UserCoverLetterDocument, {
      data: coverLetterData,
    }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(doc);

    // Increment cover letter generation counter
    const { data: fresh } = await supabase
      .from("cv_users")
      .select("cl_generations_used")
      .eq("id", user.id)
      .single();
    const newCount = (fresh?.cl_generations_used ?? 0) + 1;

    await Promise.all([
      supabase
        .from("cv_users")
        .update({ cl_generations_used: newCount, updated_at: new Date().toISOString() })
        .eq("id", user.id),
      supabase
        .from("cl_generations")
        .insert({ user_id: user.id, cl_data: coverLetterData as unknown as Record<string, unknown> }),
    ]);

    const safeName = (coverLetterData.personal.fullName || "cover-letter")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const safeCompany = (coverLetterData.recipient.company || "application")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-cover-letter-${safeCompany}.pdf"`,
        "Cache-Control": "no-store",
        "X-CL-Generations-Used": String(newCount),
        "X-Free-Limit": String(FREE_GENERATIONS),
      },
    });
  } catch (err) {
    console.error("[Cover Letter Generate]", err);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
