import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./dashboard";

async function getData() {
  try {
    const supabase = await createClient();

    const [projectsResult, skillsResult, messagesResult, unreadResult] =
      await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase
          .from("contact_submissions")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("contact_submissions")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false),
      ]);

    const recentMessages = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const recentProjects = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      stats: {
        projectsCount: projectsResult.count || 0,
        skillsCount: skillsResult.count || 0,
        messagesCount: messagesResult.count || 0,
        unreadMessagesCount: unreadResult.count || 0,
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
