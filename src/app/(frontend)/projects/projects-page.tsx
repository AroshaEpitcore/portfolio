"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechBadge, Badge } from "@/components/ui/badge";
import { LampSection } from "@/components/ui/lamp";
import { AnimatedCard } from "@/components/ui/card";
import type { Project } from "@/types/database";

interface ProjectsPageProps {
  projects?: Project[];
}

// Placeholder projects
const placeholderProjects: Partial<Project>[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "e-commerce",
    short_description:
      "A modern e-commerce platform built with Next.js, featuring real-time inventory management, secure payment processing with Stripe, and a comprehensive admin dashboard.",
    thumbnail_url: "/images/project-1.jpg",
    tech_stack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    live_url: "#",
    github_url: "#",
    is_featured: true,
  },
  {
    id: "2",
    title: "Task Management App",
    slug: "task-management",
    short_description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, team workspaces, and detailed analytics.",
    thumbnail_url: "/images/project-2.jpg",
    tech_stack: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    live_url: "#",
    github_url: "#",
    is_featured: true,
  },
  {
    id: "3",
    title: "AI Content Generator",
    slug: "ai-content",
    short_description:
      "An AI-powered content generation tool that helps create blog posts, social media content, and marketing copy using advanced language models.",
    thumbnail_url: "/images/project-3.jpg",
    tech_stack: ["Python", "FastAPI", "OpenAI", "React", "PostgreSQL"],
    live_url: "#",
    github_url: "#",
    is_featured: true,
  },
  {
    id: "4",
    title: "Real Estate Platform",
    slug: "real-estate",
    short_description:
      "A comprehensive real estate platform with property listings, virtual tours, mortgage calculator, and agent matching system.",
    thumbnail_url: "/images/project-4.jpg",
    tech_stack: ["Next.js", "Prisma", "PostgreSQL", "MapBox", "Cloudinary"],
    live_url: "#",
    github_url: "#",
    is_featured: false,
  },
  {
    id: "5",
    title: "Fitness Tracking App",
    slug: "fitness-tracker",
    short_description:
      "A mobile-first fitness tracking application with workout plans, progress tracking, nutrition logging, and social features.",
    thumbnail_url: "/images/project-5.jpg",
    tech_stack: ["React Native", "Node.js", "MongoDB", "GraphQL"],
    live_url: "#",
    github_url: "#",
    is_featured: false,
  },
  {
    id: "6",
    title: "Learning Management System",
    slug: "lms",
    short_description:
      "A full-featured learning management system with course creation, video streaming, quizzes, certificates, and progress tracking.",
    thumbnail_url: "/images/project-6.jpg",
    tech_stack: ["Next.js", "TypeScript", "Mux", "Stripe", "Prisma"],
    live_url: "#",
    github_url: "#",
    is_featured: false,
  },
];

export function ProjectsPage({ projects }: ProjectsPageProps) {
  const displayProjects =
    projects && projects.length > 0 ? projects : placeholderProjects;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Get unique tech stack items
  const allTechStack = useMemo(() => {
    const techSet = new Set<string>();
    displayProjects.forEach((project) => {
      project.tech_stack?.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [displayProjects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return displayProjects.filter((project) => {
      const matchesSearch =
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesTech =
        !selectedTech || project.tech_stack?.includes(selectedTech);

      const matchesFeatured = !showFeaturedOnly || project.is_featured;

      return matchesSearch && matchesTech && matchesFeatured;
    });
  }, [displayProjects, searchQuery, selectedTech, showFeaturedOnly]);

  return (
    <div className="min-h-screen">
      {/* Hero — touches navbar */}
      <LampSection
        title="My Projects"
        description="A collection of my work and side projects"
        className="pt-16"
      />

      {/* Filters */}
      <section className="relative -mt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/80 p-6 shadow-2xl shadow-primary/5 backdrop-blur-sm"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border/60 bg-background/60 pl-10 focus:border-primary/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`gap-2 ${showFeaturedOnly ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20" : ""}`}
                >
                  <Sparkles className="h-4 w-4" />
                  Featured
                </Button>
                <Button
                  variant={!selectedTech && !showFeaturedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSelectedTech(null); setShowFeaturedOnly(false); }}
                >
                  All
                </Button>
              </div>
            </div>

            {/* Tech Filter Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {allTechStack.slice(0, 10).map((tech) => (
                <Badge
                  key={tech}
                  variant={selectedTech === tech ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTech === tech
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-sm shadow-primary/20"
                      : "hover:border-primary/50 hover:text-primary"
                  }`}
                  onClick={() =>
                    setSelectedTech(selectedTech === tech ? null : tech)
                  }
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProjects.map((project, index) => (
                  <AnimatedCard
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                  >
                    {/* Gradient border glow on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      {project.thumbnail_url ? (
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title || "Project"}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5">
                          <span className="text-5xl font-bold text-primary/30">
                            {project.title?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {project.is_featured && (
                        <div className="absolute left-4 top-4">
                          <Badge className="gap-1 bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                      <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {project.short_description}
                      </p>

                      {/* Tech Stack */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tech_stack?.slice(0, 4).map((tech) => (
                          <TechBadge key={tech}>{tech}</TechBadge>
                        ))}
                        {project.tech_stack && project.tech_stack.length > 4 && (
                          <TechBadge>+{project.tech_stack.length - 4}</TechBadge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.slug}`} className="flex-1">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-sm hover:opacity-90 hover:shadow-primary/30"
                          >
                            View Details
                          </Button>
                        </Link>
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 hover:border-primary/50 hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 hover:border-primary/50 hover:text-primary"
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No projects found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 hover:border-primary/50 hover:text-primary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTech(null);
                    setShowFeaturedOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
