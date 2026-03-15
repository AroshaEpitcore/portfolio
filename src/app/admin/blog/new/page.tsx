"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, type Resolver } from "react-hook-form";
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

export default function NewBlogPostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { read_time: 5, is_featured: false, is_published: false, tags: "" },
  });

  const titleValue = watch("title");

  const handleTitleBlur = () => {
    if (titleValue) {
      const slug = titleValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const tagsArray = data.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("blog_posts").insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content || null,
      thumbnail_url: thumbnailUrl || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      read_time: data.read_time,
      is_featured: data.is_featured,
      is_published: data.is_published,
      order_index: 0,
    });

    if (error) {
      toast.error("Failed to create post", { description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast.success("Post created successfully!");
    router.push("/admin/blog");
  };

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
          <h1 className="text-3xl font-bold">New Post</h1>
          <p className="text-muted-foreground">Write a new blog article</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title + Slug */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Title *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="My Awesome Article" {...register("title")} onBlur={handleTitleBlur} />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Slug *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="my-awesome-article" {...register("slug")} />
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
              <p className="mt-1 text-xs text-muted-foreground">Auto-filled from title — URL: /blog/slug</p>
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
              <Textarea placeholder={`# Heading\n\nYour article content here...\n\n## Section\n\nMore content...`}
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
            Create Post
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
