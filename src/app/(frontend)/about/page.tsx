import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AboutPage } from "./about-page";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me, my experience, and my skills.",
};

async function getData() {
  try {
    const supabase = await createClient();

    const [profileResult, experiencesResult, skillsResult, educationResult] = await Promise.all([
      supabase.from("profiles").select("*").single(),
      supabase.from("experiences").select("*").order("order_index", { ascending: true }),
      supabase.from("skills").select("*").order("order_index", { ascending: true }),
      supabase.from("education").select("*").order("order_index", { ascending: true }),
    ]);

    return {
      profile: profileResult.data,
      experiences: experiencesResult.data,
      skills: skillsResult.data,
      education: educationResult.data,
    };
  } catch {
    return {
      profile: null,
      experiences: null,
      skills: null,
      education: null,
    };
  }
}

export default async function Page() {
  const { profile, experiences, skills, education } = await getData();

  return (
    <AboutPage
      profile={profile || undefined}
      experiences={experiences || undefined}
      skills={skills || undefined}
      education={education || undefined}
    />
  );
}
