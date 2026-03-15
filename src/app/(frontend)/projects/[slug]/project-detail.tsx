"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Star,
  ArrowRight,
  Globe,
  Code2,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectDetailPageProps {
  project: Project;
  relatedProjects?: Project[];
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`Screenshot ${current + 1}`}
          width={1400}
          height={900}
          className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-80"
        >
          <X className="h-4 w-4" />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div className="relative aspect-video overflow-hidden">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-4xl font-bold text-muted-foreground/30">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
          <div className="p-4">
            <h3 className="mb-1.5 font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.short_description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech_stack?.slice(0, 3).map((tech) => (
                <TechBadge key={tech} className="text-xs">
                  {tech}
                </TechBadge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Description Renderer ─────────────────────────────────────────────────────
function DescriptionRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mb-4 mt-10 text-2xl font-bold text-foreground first:mt-0">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mb-3 mt-7 text-xl font-semibold text-foreground">
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="my-4 space-y-2">
          {items.map((item, idx) => {
            const boldMatch = item.match(/^\*\*(.+?)\*\*: (.+)/);
            return (
              <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {boldMatch ? (
                  <span>
                    <strong className="text-foreground">{boldMatch[1]}</strong>
                    {": "}
                    {boldMatch[2]}
                  </span>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.replace(
                        /\*\*(.+?)\*\*/g,
                        "<strong style='color:inherit;filter:brightness(1.4)'>$1</strong>"
                      ),
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      );
      continue;
    } else if (line.trim() !== "") {
      elements.push(
        <p key={i} className="my-3 leading-relaxed text-muted-foreground">
          <span
            dangerouslySetInnerHTML={{
              __html: line.replace(
                /\*\*(.+?)\*\*/g,
                "<strong style='color:inherit;filter:brightness(1.4)'>$1</strong>"
              ),
            }}
          />
        </p>
      );
    }
    i++;
  }

  return <>{elements}</>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function ProjectDetailPage({ project, relatedProjects }: ProjectDetailPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-60px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const allImages = [
    ...(project.thumbnail_url ? [project.thumbnail_url] : []),
    ...(project.images ?? []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[72vh] min-h-[540px] overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 via-muted to-accent/20" />
          )}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        {/* Top fade — keeps navbar readable over any image */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/80 to-transparent" />

        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[130px]" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-4 top-20 z-10 sm:left-8"
        >
          <Link href="/projects">
            <Button
              variant="ghost"
              className="gap-2 border border-border/30 bg-background/30 backdrop-blur-sm hover:bg-background/60"
            >
              <ArrowLeft className="h-4 w-4" />
              All Projects
            </Button>
          </Link>
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-14 sm:px-8 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 flex flex-wrap items-center gap-2.5"
            >
              {project.is_featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(project.created_at)}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {project.title}
            </motion.h1>

            {/* Short description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-7 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              {project.short_description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 shadow-lg">
                    <Globe className="h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="gap-2 border-border/50 bg-background/40 backdrop-blur-sm hover:bg-background/70"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </Button>
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div className="min-w-0">

            {/* About section */}
            {project.long_description && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-14"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">About this Project</h2>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8">
                  <DescriptionRenderer content={project.long_description} />
                </div>
              </motion.div>
            )}

            {/* Screenshots / Gallery */}
            {allImages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Code2 className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Screenshots</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {allImages.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-border/50 bg-muted"
                      onClick={() => setLightboxIndex(i)}
                    >
                      <Image
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-background/0 transition-colors duration-300 group-hover:bg-background/20" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                          Click to enlarge
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">

            {/* Links */}
            {(project.live_url || project.github_url) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-5"
              >
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Project Links
                </h3>
                <div className="space-y-2.5">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Live Demo</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      <Github className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate">Source Code</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tech Stack */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-border/50 bg-card p-5"
              >
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <TechBadge key={tech}>{tech}</TechBadge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card p-5"
            >
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="font-medium text-foreground">{formatDate(project.created_at)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Published
                    </span>
                  </dd>
                </div>
                {project.is_featured && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Featured</dt>
                    <dd>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Star className="h-3 w-3 fill-current" />
                        Yes
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </motion.div>

          </aside>
        </div>

        {/* ── Related Projects ─────────────────────────────────────────── */}
        {relatedProjects && relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-20 border-t border-border/50 pt-16"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">More Projects</h2>
              <Link href="/projects">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => (
                <RelatedCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
