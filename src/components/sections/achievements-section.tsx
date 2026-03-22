"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, CalendarDays, ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Achievement } from "@/types/database";
import { ShareButton } from "@/components/ui/share-button";

interface Props {
  achievements?: Achievement[];
  hideHeader?: boolean;
}

const categoryConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  certification: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Certification" },
  award:         { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Award" },
  achievement:   { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Achievement" },
};

function ImageLightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </button>
        <motion.img
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="w-full rounded-xl object-contain max-h-[80vh]"
        />
        {images.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="mt-3 text-center text-sm text-white/60">{current + 1} / {images.length}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const cfg = categoryConfig[item.category] ?? categoryConfig.achievement;
  const images = item.images || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        className="group relative flex flex-col rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Images */}
        {images.length > 0 && (
          <div
            className="relative cursor-zoom-in overflow-hidden rounded-t-2xl"
            onClick={() => setLightbox(0)}
          >
            <img
              src={images[0]}
              alt={item.title}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </div>
            {images.length > 1 && (
              <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                +{images.length - 1}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {/* Category badge + icon */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              <Award className="h-3 w-3" />
              {cfg.label}
            </span>
            {!images.length && (
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${cfg.bg}`}>
                <Award className={`h-4 w-4 ${cfg.color}`} />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold leading-snug text-foreground">{item.title}</h3>
            {item.issuer && <p className={`mt-0.5 text-sm font-medium ${cfg.color}`}>{item.issuer}</p>}
          </div>

          {item.issue_date && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(item.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {item.expiry_date && (
                <span>— {new Date(item.expiry_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              )}
            </div>
          )}

          {item.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          )}

          {/* Thumbnail strip for multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.slice(1).map((img, idx) => (
                <button key={idx} onClick={() => setLightbox(idx + 1)}
                  className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <img src={img} alt={`img ${idx + 2}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          {item.credential_url ? (
            <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color} hover:underline`}>
              <ExternalLink className="h-3.5 w-3.5" />
              View Credential
            </a>
          ) : <span />}
          <div className="flex items-center gap-2">
            <ShareButton
              size="sm"
              title={item.title}
              text={item.issuer ? `${item.title} — ${item.issuer}` : item.title}
              url={typeof window !== "undefined" ? `${window.location.origin}/achievements/${item.id}` : `/achievements/${item.id}`}
            />
            <Link href={`/achievements/${item.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-primary/30 transition-opacity group-hover:opacity-100" />
      </motion.div>

      <AnimatePresence>
        {lightbox !== null && (
          <ImageLightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export function AchievementsSection({ achievements, hideHeader = false }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!achievements || achievements.length === 0) return null;

  const filters = ["all", ...Array.from(new Set(achievements.map((a) => a.category)))];
  const filtered = activeFilter === "all" ? achievements : achievements.filter((a) => a.category === activeFilter);

  return (
    <section id="achievements" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Trophy className="h-4 w-4" />
              Achievements & Certifications
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What I&apos;ve{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Accomplished
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Certifications, awards, and milestones from my professional journey.
            </p>
          </motion.div>
        )}

        {/* Filter tabs */}
        {filters.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-wrap justify-center gap-2"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : (categoryConfig[f]?.label ?? f)}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <AchievementCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
