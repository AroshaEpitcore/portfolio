"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database";

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });
    setProjects(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const togglePublished = async (project: Project) => {
    await supabase
      .from("projects")
      .update({ is_published: !project.is_published })
      .eq("id", project.id);
    fetchProjects();
  };

  const toggleFeatured = async (project: Project) => {
    await supabase
      .from("projects")
      .update({ is_featured: !project.is_featured })
      .eq("id", project.id);
    fetchProjects();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const published = projects.filter((p) => p.is_published).length;
  const featured = projects.filter((p) => p.is_featured).length;
  const drafts = projects.filter((p) => !p.is_published).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          { label: "Total", value: projects.length, color: "text-foreground" },
          { label: "Published", value: published, color: "text-green-500" },
          { label: "Drafts", value: drafts, color: "text-yellow-500" },
          { label: "Featured", value: featured, color: "text-blue-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-full border-2 border-muted border-t-primary"
          />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center"
        >
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No projects found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Create your first project to get started"}
            </p>
          </div>
          {!searchQuery && (
            <Link href="/admin/projects/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                {/* Badges overlay */}
                <div className="absolute left-3 top-3 flex gap-2">
                  {project.is_featured && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-white" /> Featured
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm ${
                      project.is_published
                        ? "bg-green-500/90 text-white"
                        : "bg-zinc-800/80 text-zinc-200"
                    }`}
                  >
                    {project.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-semibold leading-tight">{project.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">/{project.slug}</p>
                </div>

                {project.short_description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.short_description}
                  </p>
                )}

                {/* Tech stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tech_stack.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                <p className="mt-auto text-xs text-muted-foreground">
                  {formatDate(project.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFeatured(project)}
                    title={project.is_featured ? "Remove from featured" : "Mark as featured"}
                    className="h-8 w-8"
                  >
                    <Star
                      className={`h-4 w-4 ${project.is_featured ? "fill-yellow-500 text-yellow-500" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePublished(project)}
                    title={project.is_published ? "Unpublish" : "Publish"}
                    className="h-8 w-8"
                  >
                    {project.is_published ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
