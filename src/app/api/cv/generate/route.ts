import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UserCVDocument } from "@/lib/cv-user-pdf";
import type { CVFormData } from "@/types/database";
import { FREE_GENERATIONS } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please create an account or log in to generate your CV." },
        { status: 401 }
      );
    }

    const cvData: CVFormData = await request.json();

    // Upsert cv_user record
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

    if (upsertError) {
      // Try to just select if upsert failed
      const { data: existing } = await supabase
        .from("cv_users")
        .select()
        .eq("id", user.id)
        .single();

      if (!existing) {
        return NextResponse.json(
          { error: "Failed to get user record" },
          { status: 500 }
        );
      }

      // Check limits
      if (existing.generations_used >= FREE_GENERATIONS && !existing.is_paid) {
        return NextResponse.json(
          {
            error: "LIMIT_REACHED",
            generations_used: existing.generations_used,
          },
          { status: 402 }
        );
      }
    } else {
      if (
        cvUser &&
        cvUser.generations_used >= FREE_GENERATIONS &&
        !cvUser.is_paid
      ) {
        return NextResponse.json(
          {
            error: "LIMIT_REACHED",
            generations_used: cvUser.generations_used,
          },
          { status: 402 }
        );
      }
    }

    // Generate PDF
    const doc = createElement(UserCVDocument, {
      data: cvData,
    }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(doc);

    // Save generation record + increment counter
    const { data: currentUser } = await supabase
      .from("cv_users")
      .select("generations_used")
      .eq("id", user.id)
      .single();

    const currentCount = currentUser?.generations_used ?? 0;

    await Promise.all([
      supabase
        .from("cv_users")
        .update({
          generations_used: currentCount + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id),
      supabase.from("cv_generations").insert({
        user_id: user.id,
        cv_data: cvData as unknown as Record<string, unknown>,
      }),
    ]);

    const safeName = (cvData.personal.fullName || "cv")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-cv.pdf"`,
        "Cache-Control": "no-store",
        "X-Generations-Used": String(currentCount + 1),
        "X-Free-Limit": String(FREE_GENERATIONS),
      },
    });
  } catch (err) {
    console.error("[CV Generate]", err);
    return NextResponse.json(
      { error: "Failed to generate CV" },
      { status: 500 }
    );
  }
}
