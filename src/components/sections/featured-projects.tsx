"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Folder,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, GlowingButton } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/badge";
import type { Project } from "@/types/database";

interface FeaturedProjectsProps {
  projects?: Project[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
  }),
};

const ProjectSlide = ({ project }: { project: Partial<Project> }) => {
  return (
    <div className="relative w-full h-full flex items-center overflow-hidden">
      {/* Background image */}
      {project.thumbnail_url ? (
        <Image
          src={project.thumbnail_url}
          alt={project.title || "Project"}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-muted to-accent/20" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Animated blur accent */}
      <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-2xl">
          {/* Featured badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm"
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            Featured Project
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl leading-tight"
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            {project.short_description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {project.tech_stack?.slice(0, 6).map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Link href={`/projects/${project.slug}`}>
              <Button className="gap-2 group/btn">
                View Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;
  return <FeaturedProjectsContent projects={projects} />;
}

function FeaturedProjectsContent({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, projects.length]);

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Drag / swipe support
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false);
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  return (
    <section ref={containerRef} className="relative overflow-hidden py-20">
      {/* Animated background */}
      <motion.div style={{ y: backgroundY }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute left-0 bottom-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[180px]" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Folder className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Featured Work</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            <span className="text-foreground">Recent</span>{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
              Projects
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Here are some of my recent projects. Each one showcases different
            skills and technologies I&apos;ve mastered.
          </motion.p>
        </div>

        {/* Full-screen slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-full overflow-hidden"
          style={{ height: "min(80vh, 680px)" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); }}
        >
          {/* Slides */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 280, damping: 35 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
              style={{ willChange: "transform" }}
            >
              <ProjectSlide project={projects[currentIndex]} />
            </motion.div>
          </AnimatePresence>

          {/* Left arrow */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/90 hover:border-primary/40 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Right arrow */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-background/90 hover:border-primary/40 shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>

          {/* Progress dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm border border-border/30">
            <span className="text-foreground font-medium">{currentIndex + 1}</span>
            <span>/</span>
            <span>{projects.length}</span>
          </div>

          {/* Auto-play progress bar */}
          {!isPaused && (
            <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-border/30">
              <motion.div
                key={`progress-${currentIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-primary origin-left"
              />
            </div>
          )}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/projects">
            <GlowingButton className="group">
              <span className="flex items-center gap-2">
                View All Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </GlowingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
