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
import type { Project } from "@/types/database";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  short_description: z.string().min(10, "Short description must be at least 10 characters"),
  long_description: z.string().optional(),
  thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tech_stack: z.string(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    const { data } = await supabase.from("projects").select("*").eq("id", id).single();
    if (data) {
      setProject(data);
      setThumbnailUrl(data.thumbnail_url || null);
      reset({
        title: data.title,
        slug: data.slug,
        short_description: data.short_description || "",
        long_description: data.long_description || "",
        thumbnail_url: data.thumbnail_url || "",
        live_url: data.live_url || "",
        github_url: data.github_url || "",
        tech_stack: data.tech_stack?.join(", ") || "",
        is_featured: data.is_featured,
        is_published: data.is_published,
      });
    }
    setLoading(false);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    const techStackArray = data.tech_stack.split(",").map((s) => s.trim()).filter(Boolean);

    const { error } = await supabase.from("projects").update({
      title: data.title, slug: data.slug,
      short_description: data.short_description,
      long_description: data.long_description || null,
      thumbnail_url: thumbnailUrl || data.thumbnail_url || null,
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      tech_stack: techStackArray,
      is_featured: data.is_featured,
      is_published: data.is_published,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      toast.error("Failed to update project", { description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast.success("Project updated successfully!");
    router.push("/admin/projects");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/admin/projects"><Button variant="outline">Back to Projects</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <Link href="/admin/projects">
            <Button variant="ghost" className="mb-2 gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update details for <span className="font-medium text-foreground">{project.title}</span></p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Title + Slug */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Title *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="My Awesome Project" {...register("title")} />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Slug *</CardTitle></CardHeader>
            <CardContent>
              <Input placeholder="my-awesome-project" {...register("slug")} />
              {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2: Short Description + Tech Stack / Visibility */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Short Description *</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="A brief description of your project" rows={4} {...register("short_description")} />
              {errors.short_description && <p className="mt-1 text-sm text-red-500">{errors.short_description.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Tech Stack & Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input placeholder="React, TypeScript, Node.js, PostgreSQL" {...register("tech_stack")} />
                <p className="mt-1 text-xs text-muted-foreground">Comma-separated values</p>
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

        {/* Row 3: Long Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Long Description</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Detailed description (Markdown supported)" rows={8} {...register("long_description")} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 4: URLs (3 cols) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-base">Thumbnail</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                folder="projects"
                label="thumbnail"
                aspectRatio="video"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Live Demo URL</CardTitle></CardHeader>
            <CardContent>
              <Input type="url" placeholder="https://myproject.com" {...register("live_url")} />
              {errors.live_url && <p className="mt-1 text-sm text-red-500">{errors.live_url.message}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">GitHub URL</CardTitle></CardHeader>
            <CardContent>
              <Input type="url" placeholder="https://github.com/username/repo" {...register("github_url")} />
              {errors.github_url && <p className="mt-1 text-sm text-red-500">{errors.github_url.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex justify-end gap-4 pb-6">
          <Link href="/admin/projects"><Button variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
