import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactCTA } from "@/components/sections/contact-cta";
import { GitHubReposSection } from "@/components/sections/github-repos";
import { AchievementsSection } from "@/components/sections/achievements-section";
import { createClient } from "@/lib/supabase/server";
import { getGitHubRepos } from "@/lib/github";

async function getData() {
  try {
    const supabase = await createClient();

    const [profileResult, projectsResult, skillsResult, contactResult, testimonialsResult, githubRepos, achievementsResult] =
      await Promise.all([
        supabase.from("profiles").select("*").single(),
        supabase
          .from("projects")
          .select("*")
          .eq("is_featured", true)
          .eq("is_published", true)
          .order("order_index", { ascending: true }),
        supabase
          .from("skills")
          .select("*")
          .order("order_index", { ascending: true }),
        supabase.from("contact_info").select("*").single(),
        supabase
          .from("testimonials")
          .select("*")
          .order("order_index", { ascending: true }),
        getGitHubRepos(),
        supabase.from("achievements").select("*").order("order_index", { ascending: true }),
      ]);

    return {
      profile: profileResult.data,
      projects: projectsResult.data,
      skills: skillsResult.data,
      contact: contactResult.data,
      testimonials: testimonialsResult.data,
      githubRepos,
      achievements: achievementsResult.data,
    };
  } catch {
    return {
      profile: null,
      projects: null,
      skills: null,
      contact: null,
      testimonials: null,
      githubRepos: [],
      achievements: null,
    };
  }
}

export default async function HomePage() {
  const { profile, projects, skills, contact, testimonials, githubRepos, achievements } = await getData();

  return (
    <>
      <Hero
        name={profile?.name || undefined}
        title={profile?.title || undefined}
        bio={profile?.bio || undefined}
        resumeUrl={profile?.resume_url || undefined}
        heroImageUrl={profile?.avatar_url || undefined}
      />
      <AboutPreview
        name={profile?.name || undefined}
        title={profile?.title || undefined}
        avatarUrl={profile?.avatar_url || undefined}
        shortBio={profile?.bio || undefined}
      />
      <FeaturedProjects projects={projects || undefined} />
      <SkillsSection skills={skills || undefined} />
      <GitHubReposSection repos={githubRepos} />
      <AchievementsSection achievements={achievements || undefined} />
      <TestimonialsSection testimonials={testimonials || undefined} />
      <ContactCTA
        email={contact?.email || undefined}
        availability={contact?.availability || undefined}
        location={contact?.location || undefined}
      />
    </>
  );
}
