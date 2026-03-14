import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProjectsPage } from "./projects-page";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development projects.",
};

async function getData() {
  try {
    const supabase = await createClient();

    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    return { projects };
  } catch {
    return { projects: null };
  }
}

export default async function Page() {
  const { projects } = await getData();

  return <ProjectsPage projects={projects || undefined} />;
}
