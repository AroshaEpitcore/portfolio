"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string; // coloured part of the title (appended after title)
  description?: string;
}

export function PageHero({ badge, title, titleAccent, description }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-background pt-28 pb-16">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_50%,transparent_100%)]" />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-0 left-1/4 h-[200px] w-[300px] rounded-full bg-accent/8 blur-[80px]" />
        <div className="absolute top-0 right-1/4 h-[200px] w-[300px] rounded-full bg-primary/8 blur-[80px]" />
      </div>

      {/* Animated beam line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-px w-[600px] bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {badge}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                {titleAccent}
              </span>
            </>
          )}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            {description}
          </motion.p>
        )}

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </div>
  );
}
