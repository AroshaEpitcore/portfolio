import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UserCoverLetterDocument } from "@/lib/cover-letter-pdf";
import type { CoverLetterFormData } from "@/lib/cover-letter-pdf";

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
        { error: "Please log in to generate your cover letter." },
        { status: 401 }
      );
    }

    const coverLetterData: CoverLetterFormData = await request.json();

    // Generate PDF
    const doc = createElement(UserCoverLetterDocument, {
      data: coverLetterData,
    }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(doc);

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
