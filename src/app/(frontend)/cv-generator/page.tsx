import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CVGeneratorClient } from "./cv-generator-client";
import type { CVUser } from "@/types/database";

export const metadata: Metadata = {
  title: "CV Generator",
  description: "Generate your ATS-optimized CV in seconds.",
};

export const dynamic = "force-dynamic";

export default async function CVGeneratorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cvUserRecord = null;
  if (user) {
    const { data } = await supabase
      .from("cv_users")
      .select("*")
      .eq("id", user.id)
      .single();
    cvUserRecord = data;
  }

  return (
    <CVGeneratorClient
      user={
        user
          ? {
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.full_name,
            }
          : null
      }
      cvUser={cvUserRecord as CVUser | null}
    />
  );
}
