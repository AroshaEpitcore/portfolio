"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types/database";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  tags: z.string(),
  read_time: z.coerce.number().min(1).max(120),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { fetchPost(); }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (data) {
      setPost(data);
      setThumbnailUrl(data.thumbnail_url || null);
      reset({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content || "",
        tags: data.tags?.join(", ") || "",
        read_time: data.read_time,
        is_featured: data.is_featured,
        is_published: data.is_published,
      });
    }
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const tagsArray = data.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("blog_posts").update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content || null,
      thumbnail_url: thumbnailUrl || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      read_time: data.read_time,
      is_featured: data.is_featured,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      toast.error("Failed to update post", { description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast.success("Post updated successfully!");
    router.push("/admin/blog");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Post not found</p>
        <Link href="/admin/blog"><Button variant="outline">Back to Blog</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <Link href="/admin/blog">
            <Button variant="ghost" className="mb-2 gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Editing <span className="font-medium text-foreground">{post.title}</span></p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title + Slug */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Title *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="My Awesome Article" {...register("title")} />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Slug *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="my-awesome-article" {...register("slug")} />
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              <p className="mt-1 text-xs text-muted-foreground">URL: /blog/slug</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Excerpt + Tags/Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Excerpt</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="A short summary shown on the blog list page..." rows={4} {...register("excerpt")} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Tags & Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tags</Label>
                <Input className="mt-1" placeholder="Next.js, React, Tutorial" {...register("tags")} />
                <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
              </div>
              <div>
                <Label>Read Time (minutes)</Label>
                <Input className="mt-1" type="number" min={1} max={120} {...register("read_time")} />
              </div>
              <div className="space-y-2 pt-1">
                <Label className="text-sm font-medium">Visibility</Label>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded border-border accent-primary" />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register("is_published")} className="h-4 w-4 rounded border-border accent-primary" />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Content (Markdown supported)</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder={`# Heading\n\nYour article content here...`}
                rows={16} className="font-mono text-sm" {...register("content")} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Thumbnail */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="max-w-sm">
          <Card>
            <CardHeader><CardTitle className="text-base">Thumbnail</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} folder="blog" label="thumbnail" aspectRatio="video" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex justify-end gap-4 pb-6">
          <Link href="/admin/blog"><Button variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
