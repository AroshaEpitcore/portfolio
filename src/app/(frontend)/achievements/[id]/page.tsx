import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementDetailPage } from "./achievement-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("achievements")
      .select("title, description, images")
      .eq("id", id)
      .single();

    if (!data) return { title: "Achievement Not Found" };

    return {
      title: data.title,
      description: data.description ?? undefined,
      openGraph: data.images?.[0] ? { images: [{ url: data.images[0] }] } : undefined,
    };
  } catch {
    return { title: "Achievement" };
  }
}

async function getData(id: string) {
  try {
    const supabase = await createClient();
    const [achievementResult, relatedResult] = await Promise.all([
      supabase.from("achievements").select("*").eq("id", id).single(),
      supabase.from("achievements").select("*").neq("id", id).order("order_index", { ascending: true }).limit(3),
    ]);
    return {
      achievement: achievementResult.data,
      related: relatedResult.data ?? [],
    };
  } catch {
    return { achievement: null, related: [] };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const { achievement, related } = await getData(id);

  if (!achievement) notFound();

  return <AchievementDetailPage achievement={achievement} related={related} />;
}
