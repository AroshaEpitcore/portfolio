import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AchievementsSection } from "@/components/sections/achievements-section";
import { PageHero } from "@/components/sections/page-hero";
import { Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Achievements & Certifications",
  description: "Certifications, awards, and milestones from my professional journey.",
};

async function getData() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("order_index", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AchievementsPage() {
  const achievements = await getData();

  return (
    <div className="min-h-screen">
      <PageHero
        badge="Achievements"
        title="What I've"
        titleAccent="Accomplished"
        description="Certifications, awards, and milestones from my professional journey."
      />

      {achievements.length === 0 ? (
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No achievements yet</p>
              <p className="text-sm text-muted-foreground">Check back soon!</p>
            </div>
          </div>
        </section>
      ) : (
        <AchievementsSection achievements={achievements} hideHeader />
      )}
    </div>
  );
}
