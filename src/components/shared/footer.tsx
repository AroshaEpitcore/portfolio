"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  ArrowUpRight,
  MapPin,
  GitBranch,
  Code2,
} from "lucide-react";
import { GITHUB_PROFILE_URL } from "@/lib/github";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const resourceLinks = [
  { name: "GitHub Repos", href: "/github", icon: GitBranch },
  { name: "Source Code", href: GITHUB_PROFILE_URL, icon: Code2, external: true },
];

const socialLinks = [
  { name: "GitHub", href: GITHUB_PROFILE_URL, icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/arosha-ravishan-89b459247/", icon: Linkedin },
  { name: "WhatsApp", href: "https://wa.me/94762946381", icon: MessageCircle },
  { name: "Email", href: "mailto:hello@example.com", icon: Mail },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Top CTA strip ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-5 border-b border-border/50 py-12 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                amazing
              </span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Available for freelance projects and full-time opportunities.
            </p>
          </div>
          <a
            href="mailto:hello@example.com"
            className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-primary/10"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent"
            >
              Portfolio
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Building beautiful, performant, and accessible web experiences with modern technologies.
            </p>

            {/* Location */}
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Sri Lanka
            </div>

            {/* Social icons */}
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={fadeUp}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="h-px w-3 bg-border transition-all group-hover:w-5 group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Open Source
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.li key={link.name} variants={fadeUp}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icon className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary" />
                        {link.name}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icon className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary" />
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {/* Status badge */}
            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for work
            </motion.div>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Built With
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"].map((tech) => (
                <motion.span
                  key={tech}
                  variants={fadeUp}
                  className="rounded-lg border border-border/50 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between gap-3 border-t border-border/50 py-6 text-xs text-muted-foreground sm:flex-row"
        >
          <p>© {currentYear} Portfolio · All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Designed &amp; built by
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                AroshaRavishan
              </a>
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span>Made with Next.js 16</span>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
