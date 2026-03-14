"use client";

import React, { useState } from "react";
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
import { slugify } from "@/lib/utils";

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

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_featured: false,
      is_published: false,
      tech_stack: "",
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("title", value);
    setValue("slug", slugify(value));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    const techStackArray = data.tech_stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { error } = await supabase.from("projects").insert({
      title: data.title,
      slug: data.slug,
      short_description: data.short_description,
      long_description: data.long_description || null,
      thumbnail_url: thumbnailUrl || data.thumbnail_url || null,
      live_url: data.live_url || null,
      github_url: data.github_url || null,
      tech_stack: techStackArray,
      is_featured: data.is_featured,
      is_published: data.is_published,
    });

    if (error) {
      toast.error("Failed to create project", { description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast.success("Project created successfully!");
    router.push("/admin/projects");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Link href="/admin/projects">
            <Button variant="ghost" className="mb-2 gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Project</h1>
          <p className="text-muted-foreground">Create a new portfolio project</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Title + Slug */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Title *</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="title"
                placeholder="My Awesome Project"
                {...register("title")}
                onChange={handleTitleChange}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Slug *</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="slug"
                placeholder="my-awesome-project"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2: Short Description + Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Short Description *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="short_description"
                placeholder="A brief description of your project"
                rows={4}
                {...register("short_description")}
              />
              {errors.short_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.short_description.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  id="tech_stack"
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  {...register("tech_stack")}
                />
                <p className="mt-1 text-xs text-muted-foreground">Comma-separated values</p>
              </div>
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium">Visibility</Label>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      {...register("is_featured")}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      {...register("is_published")}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 3: Long Description (full width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Long Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="long_description"
                placeholder="Detailed description of your project (Markdown supported)"
                rows={8}
                {...register("long_description")}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 4: URLs (3 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thumbnail</CardTitle>
            </CardHeader>
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
            <CardHeader>
              <CardTitle className="text-base">Live Demo URL</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="live_url"
                type="url"
                placeholder="https://myproject.com"
                {...register("live_url")}
              />
              {errors.live_url && (
                <p className="mt-1 text-sm text-red-500">{errors.live_url.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">GitHub URL</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="github_url"
                type="url"
                placeholder="https://github.com/username/repo"
                {...register("github_url")}
              />
              {errors.github_url && (
                <p className="mt-1 text-sm text-red-500">{errors.github_url.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-end gap-4 pb-6"
        >
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Create Project
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
