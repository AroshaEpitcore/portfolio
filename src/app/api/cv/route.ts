import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { CVDocument } from "@/lib/cv-pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const [
      profileRes,
      expRes,
      eduRes,
      skillsRes,
      projectsRes,
      contactRes,
      achievementsRes,
      socialRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*").single(),
      supabase.from("experiences").select("*").order("order_index", { ascending: true }),
      supabase.from("education").select("*").order("order_index", { ascending: true }),
      supabase.from("skills").select("*").order("order_index", { ascending: true }),
      supabase.from("projects").select("*").eq("is_published", true).order("order_index", { ascending: true }),
      supabase.from("contact_info").select("*").single(),
      supabase.from("achievements").select("*").order("order_index", { ascending: true }),
      supabase.from("social_links").select("*").order("order_index", { ascending: true }),
    ]);

    const profile = profileRes.data;
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const socials = socialRes.data ?? [];
    const githubLink = socials.find(
      (s) => s.platform.toLowerCase() === "github"
    );
    const linkedinLink = socials.find(
      (s) => s.platform.toLowerCase() === "linkedin"
    );

    const doc = createElement(CVDocument, {
      profile,
      experiences: expRes.data ?? [],
      education: eduRes.data ?? [],
      skills: skillsRes.data ?? [],
      projects: projectsRes.data ?? [],
      contact: contactRes.data ?? null,
      achievements: achievementsRes.data ?? [],
      githubUrl: githubLink?.url,
      linkedinUrl: linkedinLink?.url,
    }) as unknown as ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    const safeName = (profile.name ?? "resume")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-cv.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[CV API]", err);
    return NextResponse.json({ error: "Failed to generate CV" }, { status: 500 });
  }
}
