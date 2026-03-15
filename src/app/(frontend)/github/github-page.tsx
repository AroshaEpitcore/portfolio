"use client";

import React, { useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Search,
  Users,
  BookOpen,
  MapPin,
  Link as LinkIcon,
  AlertCircle,
  Clock,
  Code2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { GitHubRepo, GitHubUser } from "@/lib/github";
import { GITHUB_PROFILE_URL, LANGUAGE_COLORS } from "@/lib/github";

interface Props {
  repos: GitHubRepo[];
  user: GitHubUser | null;
}

type SortKey = "updated" | "stars" | "forks" | "name";

// ─── Repo Card ────────────────────────────────────────────────────────────────
function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? "#8b949e") : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 9) * 0.05 }}
    >
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {repo.name}
            </h3>
          </div>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Description */}
        <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {repo.description ?? "No description provided."}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary/80 border border-primary/15"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
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
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            {formatDate(repo.pushed_at)}
          </span>
        </div>

        {/* Homepage link */}
        {repo.homepage && (
          <div className="mt-3 border-t border-border/50 pt-3">
            <span className="flex items-center gap-1.5 text-[11px] text-primary truncate">
              <Globe className="h-3 w-3 flex-shrink-0" />
              {repo.homepage.replace(/^https?:\/\//, "")}
            </span>
          </div>
        )}
      </a>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function GitHubPageClient({ repos, user }: Props) {
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("updated");

  // All unique languages
  const languages = useMemo(() => {
    const langs = repos.map((r) => r.language).filter(Boolean) as string[];
    return Array.from(new Set(langs)).sort();
  }, [repos]);

  // Filtered + sorted repos
  const filtered = useMemo(() => {
    let list = repos;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedLang) {
      list = list.filter((r) => r.language === selectedLang);
    }
    return [...list].sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "forks") return b.forks_count - a.forks_count;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    });
  }, [repos, search, selectedLang, sort]);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* ── Background decoration ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        {/* ── Profile Header ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              {user?.avatar_url && (
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-primary/20 sm:h-24 sm:w-24">
                    <Image
                      src={user.avatar_url}
                      alt={user.name ?? user.login}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 rounded-full bg-background p-0.5">
                    <div className="rounded-full bg-foreground p-1.5">
                      <Github className="h-3.5 w-3.5 text-background" />
                    </div>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {user?.name ?? user?.login ?? "GitHub Repositories"}
                  </h1>
                  <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-medium text-muted-foreground">
                    @{user?.login ?? GITHUB_PROFILE_URL.split("/").pop()}
                  </span>
                </div>

                {user?.bio && (
                  <p className="mb-4 text-sm text-muted-foreground">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  {user?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {user.location}
                    </span>
                  )}
                  {user?.blog && (
                    <a
                      href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {user.blog.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {user && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <strong className="text-foreground">{user.followers}</strong> followers ·{" "}
                      <strong className="text-foreground">{user.following}</strong> following
                    </span>
                  )}
                </div>
              </div>

              {/* Open GitHub button */}
              <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Profile
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/50 pt-6 sm:grid-cols-4">
              {[
                { label: "Repositories", value: repos.length, icon: BookOpen },
                { label: "Total Stars", value: totalStars, icon: Star },
                { label: "Total Forks", value: totalForks, icon: GitFork },
                { label: "Languages", value: languages.length, icon: Code2 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <stat.icon className="h-3.5 w-3.5" />
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Filters ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* Search + Sort row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-sm"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Language filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLang(null)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedLang === null
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              All
            </button>
            {languages.map((lang) => {
              const color = LANGUAGE_COLORS[lang] ?? "#8b949e";
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang === selectedLang ? null : lang)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedLang === lang
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {lang}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
            {(search || selectedLang) ? " found" : " total"}
          </p>
        </motion.div>

        {/* ── Repo Grid ────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No repositories found</p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Try adjusting your search or filter
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
