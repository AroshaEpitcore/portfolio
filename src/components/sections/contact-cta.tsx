"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Sparkles, Send, MapPin, Clock } from "lucide-react";
import { GlowingButton, Button } from "@/components/ui/button";

interface ContactCTAProps {
  email?: string;
  availability?: string;
  location?: string;
}

export function ContactCTA({
  email = "hello@example.com",
  availability = "Available for freelance projects",
  location,
}: ContactCTAProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* Floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[20%] h-16 w-16 rounded-full border border-primary/20"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[15%] bottom-[30%] h-20 w-20 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[25%] top-[25%]"
        >
          <Sparkles className="h-8 w-8 text-primary/30" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Main card */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-xl">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-10 animate-gradient-x" />

            {/* Inner glow */}
            <div className="absolute inset-[1px] rounded-3xl bg-card" />

            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="mx-auto mb-8"
                >
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    {/* Ping effect */}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-6 w-6 rounded-full bg-primary" />
                    </span>
                  </div>
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl"
                >
                  <span className="text-foreground">Let&apos;s Create</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                    Something Amazing
                  </span>
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground"
                >
                  Have a project in mind? I&apos;d love to hear about it. Let&apos;s
                  discuss how we can collaborate to bring your ideas to life.
                </motion.p>

                {/* Info badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-10 flex flex-wrap items-center justify-center gap-4"
                >
                  {/* Availability badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-green-600 dark:text-green-400">{availability}</span>
                  </div>

                  {/* Response time badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Usually responds within 24 hours</span>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Link href="/contact">
                    <GlowingButton className="group">
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Get in Touch
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </GlowingButton>
                  </Link>
                  <a href={`mailto:${email}`}>
                    <Button
                      variant="outline"
                      className="group gap-2 border-primary/20 backdrop-blur-sm transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                    >
                      <Mail className="h-4 w-4" />
                      {email}
                    </Button>
                  </a>
                </motion.div>

                {/* Location info */}
                {location && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
