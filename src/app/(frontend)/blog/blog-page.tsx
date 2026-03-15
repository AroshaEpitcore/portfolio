"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Search, BookOpen, CalendarDays } from "lucide-react";
import { LampSection } from "@/components/ui/lamp";
import { Input } from "@/components/ui/input";
import type { BlogPost } from "@/types/database";

interface BlogPageProps {
  posts?: BlogPost[];
}

export function BlogPage({ posts }: BlogPageProps) {
  const displayPosts = posts ?? [];
  const [search, setSearch] = useState("");

  const filtered = displayPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const featured = filtered.filter((p) => p.is_featured);
  const rest = filtered.filter((p) => !p.is_featured);

  return (
    <div className="min-h-screen">
      <LampSection title="Blog" description="Thoughts, tutorials, and insights" className="pt-16" />

      <section className="relative -mt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative mb-10 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search articles..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">{search ? "No articles found" : "No articles yet"}</p>
              <p className="text-sm text-muted-foreground">{search ? "Try a different search term" : "Check back soon!"}</p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {/* Featured */}
              {featured.length > 0 && (
                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <span className="inline-block rounded-full bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-600 ring-1 ring-yellow-500/20">
                      ⭐ Featured Articles
                    </span>
                  </motion.div>
                  <div className={`grid gap-8 ${featured.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2"}`}>
                    {featured.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="mb-8 text-center">
                      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
                        All Articles
                      </span>
                    </motion.div>
                  )}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PostCard({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) {
  const date = new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-xl ${
        featured ? "border-primary/30 hover:border-primary/50" : "border-border hover:border-primary/20"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {post.thumbnail_url ? (
          <img src={post.thumbnail_url} alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h3 className={`font-bold leading-snug transition-colors group-hover:text-primary ${featured ? "text-xl" : "text-lg"} line-clamp-2`}>
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground border-t border-border">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {post.read_time} min read
          </span>
        </div>
      </div>
    </motion.article>
  );
}
