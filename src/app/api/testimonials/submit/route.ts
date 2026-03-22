import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(20).max(2000),
  rating: z.number().int().min(1).max(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, role, company, content, rating } = parsed.data;

    const supabase = await createServiceClient();
    const { error } = await supabase.from("testimonials").insert({
      name,
      role: role || null,
      company: company || null,
      content,
      rating,
      is_featured: false,
      order_index: 999,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
