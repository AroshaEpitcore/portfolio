import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./dashboard";

async function getData() {
  try {
    const supabase = await createClient();

    const [
      projectsResult,
      skillsResult,
      messagesResult,
      unreadResult,
      achievementsResult,
      servicesResult,
      blogResult,
      teamResult,
      testimonialsResult,
      experiencesResult,
    ] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("achievements").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("team_members").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("experiences").select("*", { count: "exact", head: true }),
    ]);

    const [recentMessages, recentProjects] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

    return {
      stats: {
        projectsCount: projectsResult.count || 0,
        skillsCount: skillsResult.count || 0,
        messagesCount: messagesResult.count || 0,
        unreadMessagesCount: unreadResult.count || 0,
        achievementsCount: achievementsResult.count || 0,
        servicesCount: servicesResult.count || 0,
        blogCount: blogResult.count || 0,
        teamCount: teamResult.count || 0,
        testimonialsCount: testimonialsResult.count || 0,
        experiencesCount: experiencesResult.count || 0,
      },
      recentMessages: recentMessages.data || [],
      recentProjects: recentProjects.data || [],
    };
  } catch {
    return {
      stats: {
        projectsCount: 0,
        skillsCount: 0,
        messagesCount: 0,
        unreadMessagesCount: 0,
        achievementsCount: 0,
        servicesCount: 0,
        blogCount: 0,
        teamCount: 0,
        testimonialsCount: 0,
        experiencesCount: 0,
      },
      recentMessages: [],
      recentProjects: [],
    };
  }
}

export default async function AdminPage() {
  const { stats, recentMessages, recentProjects } = await getData();

  return (
    <AdminDashboard
      stats={stats}
      recentMessages={recentMessages}
      recentProjects={recentProjects}
    />
  );
}
