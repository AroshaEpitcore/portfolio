import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET — fetch all cv_users (bypasses RLS via service role)
export async function GET() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("cv_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[admin/cv-users GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH — update is_paid for a user
export async function PATCH(request: Request) {
  try {
    const { id, is_paid } = await request.json();
    if (!id || typeof is_paid !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("cv_users")
      .update({
        is_paid,
        paid_at: is_paid ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/cv-users PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
