"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, BookOpen, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types/database";

export default function AdminBlogPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("order_index", { ascending: true });
    setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error("Failed to delete post", { description: error.message });
    else { toast.success("Post deleted"); fetchPosts(); }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.excerpt || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Write and manage your articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: posts.length, color: "text-foreground" },
          { label: "Published", value: posts.filter((p) => p.is_published).length, color: "text-green-500" },
          { label: "Drafts", value: posts.filter((p) => !p.is_published).length, color: "text-orange-500" },
          { label: "Featured", value: posts.filter((p) => p.is_featured).length, color: "text-yellow-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">{search ? "No posts found" : "No posts yet"}</p>
            <p className="text-sm text-muted-foreground">{search ? "Try a different search" : 'Click "New Post" to get started'}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden bg-muted">
                {post.thumbnail_url ? (
                  <img src={post.thumbnail_url} alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  <Badge className={post.is_published ? "bg-green-500 text-white" : "bg-orange-500 text-white"}>
                    {post.is_published ? "Published" : "Draft"}
                  </Badge>
                  {post.is_featured && (
                    <Badge className="bg-yellow-500 text-white gap-1">
                      <Star className="h-3 w-3 fill-white" /> Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold leading-tight line-clamp-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
                <div className="mt-auto flex flex-wrap gap-1 pt-2">
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{tag}</span>
                  ))}
                  <span className="ml-auto text-xs text-muted-foreground">{post.read_time} min read</span>
                </div>
              </div>

              <div className="flex justify-end gap-1 border-t border-border px-4 py-2">
                <Link href={`/admin/blog/${post.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(post.id, post.title)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
