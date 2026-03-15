"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Award, CalendarDays, ExternalLink,
  ChevronLeft, ChevronRight, X, ZoomIn, ArrowRight, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import type { Achievement } from "@/types/database";

const categoryConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  certification: { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   label: "Certification" },
  award:         { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Award" },
  achievement:   { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  label: "Achievement" },
};

// ─── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        <button onClick={onClose}
          className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:opacity-80">
          <X className="h-4 w-4" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ item, index }: { item: Achievement; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const cfg = categoryConfig[item.category] ?? categoryConfig.achievement;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}>
      <Link href={`/achievements/${item.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          {item.images && item.images[0] ? (
            <div className="relative aspect-video overflow-hidden">
              <img src={item.images[0]} alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>
          ) : (
            <div className={`flex aspect-video items-center justify-center ${cfg.bg}`}>
              <Award className={`h-8 w-8 ${cfg.color}`} />
            </div>
          )}
          <div className="p-4">
            <span className={`mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              {cfg.label}
            </span>
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-1">{item.title}</h3>
            {item.issuer && <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{item.issuer}</p>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export function AchievementDetailPage({ achievement, related }: { achievement: Achievement; related: Achievement[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-60px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const cfg = categoryConfig[achievement.category] ?? categoryConfig.achievement;
  const images = achievement.images || [];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[65vh] min-h-[500px] overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          {images[0] ? (
            <img src={images[0]} alt={achievement.title} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full ${cfg.bg} bg-gradient-to-br from-primary/20 via-background to-accent/20`} />
          )}
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[130px]" />

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="absolute left-4 top-20 z-10 sm:left-8">
          <Link href="/#achievements">
            <Button variant="ghost" className="gap-2 border border-border/30 bg-background/30 backdrop-blur-sm hover:bg-background/60">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }}
          className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {/* Category + date badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                <Award className="h-3 w-3" /> {cfg.label}
              </span>
              {achievement.issue_date && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(achievement.issue_date)}
                  {achievement.expiry_date && ` — ${formatDate(achievement.expiry_date)}`}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mb-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {achievement.title}
            </motion.h1>

            {/* Issuer */}
            {achievement.issuer && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`mb-6 text-lg font-medium ${cfg.color}`}>
                {achievement.issuer}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-3">
              {achievement.credential_url && (
                <a href={achievement.credential_url} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 shadow-lg">
                    <ExternalLink className="h-4 w-4" /> View Credential
                  </Button>
                </a>
              )}
              <ShareButton title={achievement.title} text={achievement.description ?? undefined} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div ref={contentRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div className="min-w-0 space-y-12">

            {/* Description */}
            {achievement.description && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={isContentInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">About this Achievement</h2>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8">
                  <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{achievement.description}</p>
                </div>
              </motion.div>
            )}

            {/* Images gallery */}
            {images.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 24 }} animate={isContentInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Certificate Images</h2>
                </div>
                <div className={`grid gap-4 ${images.length === 1 ? "grid-cols-1 max-w-xl" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {images.map((img, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-border/50 bg-muted"
                      onClick={() => setLightboxIndex(i)}
                    >
                      <img src={img} alt={`Image ${i + 1}`}
                        className="w-full object-contain transition-transform duration-500 group-hover:scale-105 max-h-[500px]" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <ZoomIn className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">

            {/* Details card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </dd>
                </div>
                {achievement.issuer && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">Issued by</dt>
                    <dd className="font-medium text-right">{achievement.issuer}</dd>
                  </div>
                )}
                {achievement.issue_date && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Issue Date</dt>
                    <dd className="font-medium">{formatDate(achievement.issue_date)}</dd>
                  </div>
                )}
                {achievement.expiry_date && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Expires</dt>
                    <dd className="font-medium">{formatDate(achievement.expiry_date)}</dd>
                  </div>
                )}
                {!achievement.expiry_date && achievement.issue_date && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Validity</dt>
                    <dd>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> No Expiry
                      </span>
                    </dd>
                  </div>
                )}
                {images.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Images</dt>
                    <dd className="font-medium">{images.length}</dd>
                  </div>
                )}
              </dl>
            </motion.div>

            {/* Credential + Share */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share & Verify</h3>
              {achievement.credential_url && (
                <a href={achievement.credential_url} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">Verify Credential</span>
                </a>
              )}
              <ShareButton title={achievement.title} text={achievement.description ?? undefined} className="w-full" size="sm" />
            </motion.div>
          </aside>
        </div>

        {/* ── Related ───────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
            className="mt-20 border-t border-border/50 pt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">More Achievements</h2>
              <Link href="/#achievements">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => <RelatedCard key={item.id} item={item} index={i} />)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

