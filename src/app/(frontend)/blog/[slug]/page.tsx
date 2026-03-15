import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import { BlogContent } from "./blog-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("title, excerpt, thumbnail_url")
    .eq("slug", slug).eq("is_published", true).single();

  if (!data) return { title: "Post Not Found" };

  return {
    title: data.title,
    description: data.excerpt || undefined,
    openGraph: data.thumbnail_url ? { images: [{ url: data.thumbnail_url }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back */}
        <Link href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.read_time} min read
          </span>
        </div>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img src={post.thumbnail_url} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        {/* Content */}
        {post.content ? (
          <BlogContent content={post.content} />
        ) : (
          <p className="text-muted-foreground">No content yet.</p>
        )}
      </div>
    </div>
  );
}
