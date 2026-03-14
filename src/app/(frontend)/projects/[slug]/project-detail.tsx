"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/badge";
import { AnimatedCard } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectDetailPageProps {
  project: Project;
  relatedProjects?: Project[];
}

export function ProjectDetailPage({
  project,
  relatedProjects,
}: ProjectDetailPageProps) {
  return (
    <div className="min-h-screen pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/projects">
            <Button variant="ghost" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Featured Image */}
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-muted">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-6xl font-bold text-muted-foreground/50">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {project.title}
            </h1>
            <p className="mb-6 text-xl text-muted-foreground">
              {project.short_description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(project.created_at)}</span>
              </div>
              {project.is_featured && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Featured Project
                </span>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.map((tech) => (
                <TechBadge key={tech} className="text-sm">
                  {tech}
                </TechBadge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Live Demo
                </Button>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Source Code
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          {project.long_description?.split("\n").map((line, index) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={index} className="mt-8 text-2xl font-bold">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("- **")) {
              const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
              if (match) {
                return (
                  <p key={index} className="my-2">
                    <strong>{match[1]}</strong>: {match[2]}
                  </p>
                );
              }
            }
            if (line.trim() === "") {
              return <br key={index} />;
            }
            return (
              <p key={index} className="text-muted-foreground">
                {line}
              </p>
            );
          })}
        </motion.div>
      </section>

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold">Project Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative aspect-video overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold">Related Projects</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProjects.map((relatedProject, index) => (
                <AnimatedCard
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {relatedProject.thumbnail_url ? (
                      <Image
                        src={relatedProject.thumbnail_url}
                        alt={relatedProject.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <span className="text-4xl font-bold text-muted-foreground/50">
                          {relatedProject.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold group-hover:text-primary">
                      {relatedProject.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {relatedProject.short_description}
                    </p>
                    <Link href={`/projects/${relatedProject.slug}`}>
                      <Button variant="outline" size="sm">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
