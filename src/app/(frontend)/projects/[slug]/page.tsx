import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetailPage } from "./project-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data: project } = await supabase
      .from("projects")
      .select("title, short_description, thumbnail_url")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!project) return { title: "Project Not Found" };

    return {
      title: project.title,
      description: project.short_description ?? undefined,
      openGraph: project.thumbnail_url
        ? { images: [{ url: project.thumbnail_url }] }
        : undefined,
    };
  } catch {
    return { title: "Project" };
  }
}

async function getData(slug: string) {
  try {
    const supabase = await createClient();
    const [projectResult, relatedResult] = await Promise.all([
      supabase.from("projects").select("*").eq("slug", slug).eq("is_published", true).single(),
      supabase.from("projects").select("*").eq("is_published", true).neq("slug", slug).limit(3),
    ]);
    return {
      project: projectResult.data,
      relatedProjects: relatedResult.data,
    };
  } catch {
    return { project: null, relatedProjects: null };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { project, relatedProjects } = await getData(slug);

  if (!project) notFound();

  return (
    <ProjectDetailPage
      project={project}
      relatedProjects={relatedProjects || undefined}
    />
  );
}
