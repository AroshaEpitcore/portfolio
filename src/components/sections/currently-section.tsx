"use client";

import { motion } from "framer-motion";
import { Code2, BookOpen, Music2, Lightbulb, ExternalLink } from "lucide-react";

// ── Edit these to reflect what you're currently doing ──────────────────────
const CURRENT_ITEMS = [
  {
    icon: <Code2 className="h-5 w-5" />,
    category: "Building",
    title: "AI-Powered Portfolio CMS",
    description: "A Next.js + Supabase admin dashboard with AI content suggestions.",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    iconColor: "text-violet-400",
    link: null,
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    category: "Reading",
    title: "The Pragmatic Programmer",
    description: "David Thomas & Andrew Hunt — timeless advice on writing better software.",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    iconColor: "text-blue-400",
    link: null,
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    category: "Learning",
    title: "Rust & WebAssembly",
    description: "Exploring WASM for performance-critical browser applications.",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    iconColor: "text-amber-400",
    link: null,
  },
  {
    icon: <Music2 className="h-5 w-5" />,
    category: "Listening",
    title: "lo-fi hip hop / coding beats",
    description: "Deep focus sessions with ambient electronic and lo-fi mixes.",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    iconColor: "text-emerald-400",
    link: null,
  },
] as const;
// ───────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function CurrentlySection() {
  return (
    <section className="relative py-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/20 to-muted/0" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Currently
            </span>
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            What I&apos;m{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Up To
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            A live snapshot of what&apos;s keeping me busy, curious, and inspired right now.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CURRENT_ITEMS.map((item, i) => (
            <motion.div
              key={item.category}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 ${item.color}`}
              >
                {/* Top glow line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Icon */}
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 dark:bg-white/5 ${item.iconColor}`}>
                  {item.icon}
                </div>

                {/* Category tag */}
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {item.category}
                </p>

                {/* Title */}
                <h3 className="mb-2 text-sm font-semibold leading-snug text-foreground">
                  {item.title}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 inline-flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </h3>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
