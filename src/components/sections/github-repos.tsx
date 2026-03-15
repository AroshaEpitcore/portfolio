"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Star, GitFork, ArrowRight, BookOpen, Code2, Clock } from "lucide-react";
import { GlowingButton } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { GitHubRepo } from "@/lib/github";
import { GITHUB_PROFILE_URL, LANGUAGE_COLORS } from "@/lib/github";

interface GitHubReposSectionProps {
  repos: GitHubRepo[];
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? "#8b949e") : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      {/* Share button — positioned outside the <a> to avoid nested interactive elements */}
      <div className="absolute right-3 top-3 z-10" onClick={(e) => e.stopPropagation()}>
        <ShareButton url={repo.html_url} title={repo.name} text={repo.description ?? undefined} size="sm" />
      </div>
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 pr-24 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      >
        {/* Repo name */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {repo.name}
            </h3>
          </div>
          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>

        {/* Description */}
        <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {repo.description ?? "No description provided."}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/8 border border-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary/80"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: langColor ?? "#8b949e" }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forks_count}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(repo.pushed_at)}
          </span>
        </div>
      </a>
    </motion.div>
  );
}

export function GitHubReposSection({ repos }: GitHubReposSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Top 6 by stars, then recency
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 6);

  if (topRepos.length === 0) return null;

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[150px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Github className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Open Source</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            <span className="text-foreground">GitHub</span>{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
              Repositories
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            {repos.length} public repositories · {totalStars} total stars
          </motion.p>

          {/* Quick stats chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 flex flex-wrap justify-center gap-3"
          >
            <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Code2 className="h-3 w-3 text-primary" />
              {[...new Set(repos.map((r) => r.language).filter(Boolean))].length} languages
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 text-primary" />
              {totalStars} stars earned
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <GitFork className="h-3 w-3 text-primary" />
              {repos.reduce((s, r) => s + r.forks_count, 0)} forks
            </span>
          </motion.div>
        </div>

        {/* Repo Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRepos.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/github">
            <GlowingButton className="group">
              <span className="flex items-center gap-2">
                View All Repositories
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </GlowingButton>
          </Link>
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-5 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:text-foreground">
              <Github className="h-4 w-4" />
              Open on GitHub
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
