import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactCTA } from "@/components/sections/contact-cta";
import { createClient } from "@/lib/supabase/server";

async function getData() {
  try {
    const supabase = await createClient();

    const [profileResult, projectsResult, skillsResult, contactResult] =
      await Promise.all([
        supabase.from("profiles").select("*").single(),
        supabase
          .from("projects")
          .select("*")
          .eq("is_featured", true)
          .eq("is_published", true)
          .order("order_index", { ascending: true })
          .limit(3),
        supabase
          .from("skills")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase.from("contact_info").select("*").single(),
      ]);

    return {
      profile: profileResult.data,
      projects: projectsResult.data,
      skills: skillsResult.data,
      contact: contactResult.data,
    };
  } catch {
    // Return null if Supabase is not configured
    return {
      profile: null,
      projects: null,
      skills: null,
      contact: null,
    };
  }
}

export default async function HomePage() {
  const { profile, projects, skills, contact } = await getData();

  return (
    <>
      <Hero
        name={profile?.name || undefined}
        title={profile?.title || undefined}
        bio={profile?.bio || undefined}
        resumeUrl={profile?.resume_url || undefined}
      />
      <AboutPreview
        name={profile?.name || undefined}
        avatarUrl={profile?.avatar_url || undefined}
        shortBio={profile?.bio || undefined}
      />
      <FeaturedProjects projects={projects || undefined} />
      <SkillsSection skills={skills || undefined} />
      <ContactCTA
        email={contact?.email || undefined}
        availability={contact?.availability || undefined}
      />
    </>
  );
}
