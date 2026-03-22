"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Palette,
  Download,
  Shield,
  LayoutTemplate,
  Globe,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Instant PDF Generation",
    description: "Fill in your details and get a professionally formatted PDF in seconds — no design skills needed.",
  },
  {
    icon: LayoutTemplate,
    title: "ATS-Optimized Layout",
    description: "Two-column structure with clean typography passes Applicant Tracking Systems used by top companies.",
  },
  {
    icon: Palette,
    title: "Fully Customizable Style",
    description: "Choose font, accent color, header alignment, and spacing. Your CV, your look.",
  },
  {
    icon: Globe,
    title: "Auto-Save Draft",
    description: "Your progress is saved automatically as you type — come back anytime and pick up right where you left off.",
  },
  {
    icon: Shield,
    title: "Structured Sections",
    description: "Experience, Education, Skills, Projects, Certifications, Languages, Volunteer, References and Custom sections.",
  },
  {
    icon: Download,
    title: "Download & Share",
    description: "Download as a clean PDF ready to attach to any job application, LinkedIn, or email.",
  },
];

const highlights = [
  "Free account required to get started",
  "2 free generations included",
  "Works on any device",
  "Real-time PDF preview",
  "Multiple font & color options",
  "One-time unlock for unlimited use",
];

export function CVGeneratorPromo() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute left-0 bottom-1/4 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/3 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Free Tool — Sign up &amp; Start Building
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-foreground">Build Your </span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
              Perfect CV
            </span>
            <br />
            <span className="text-foreground">in Minutes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            A powerful, browser-based CV generator that creates ATS-friendly, beautifully
            designed resumes — tailored to your style, downloaded as a ready-to-send PDF.
          </motion.p>
        </div>

        {/* Main content — left: features, right: preview card */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

          {/* Features grid */}
          <div className="flex-1">
            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="group rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary/20">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-foreground">{feat.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{feat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-80 shrink-0"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-xl shadow-primary/5">
              {/* Top gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />

              <div className="p-7">
                {/* Icon */}
                <div className="mb-5 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-xl" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="mb-1 text-center text-xl font-bold">CV Generator</h3>
                <p className="mb-5 text-center text-sm text-muted-foreground">
                  Professional resumes, beautifully crafted
                </p>

                {/* Highlights checklist */}
                <ul className="mb-6 space-y-2.5">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/cv-generator" className="block">
                  <GlowingButton className="group w-full justify-center">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Build My CV Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </GlowingButton>
                </Link>

                {/* Fine print */}
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  2 free generations · Unlock unlimited for Rs. 250
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-xs text-green-600 dark:text-green-400"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              Free to use — start building now
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
