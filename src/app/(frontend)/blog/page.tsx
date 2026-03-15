import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogPage } from "./blog-page";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on web development.",
};

async function getData() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });
    return { posts: data };
  } catch {
    return { posts: null };
  }
}

export default async function Page() {
  const { posts } = await getData();
  return <BlogPage posts={posts || undefined} />;
}
