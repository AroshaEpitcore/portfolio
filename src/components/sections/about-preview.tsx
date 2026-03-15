"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, Palette, Zap, Sparkles, Rocket, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutPreviewProps {
  name?: string;
  title?: string;
  avatarUrl?: string;
  shortBio?: string;
}

const features = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable, and well-documented code that stands the test of time.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Modern Design",
    description: "Creating beautiful, intuitive, and user-friendly interfaces that delight users.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimizing for speed, accessibility, and SEO to deliver lightning-fast experiences.",
    gradient: "from-orange-500 to-yellow-500",
  },
];

const stats = [
  { value: "50+", label: "Projects Completed", icon: Rocket },
  { value: "3+", label: "Years Experience", icon: Coffee },
  { value: "100%", label: "Client Satisfaction", icon: Sparkles },
];

export function AboutPreview({
  name = "John Doe",
  title,
  avatarUrl,
  shortBio = "A passionate full-stack developer with expertise in building modern web applications. I love turning complex problems into simple, beautiful solutions.",
}: AboutPreviewProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">About Me</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            <span className="text-foreground">Crafting Digital</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
              Experiences
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Transforming ideas into exceptional digital solutions with creativity and precision.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: About content with image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            {/* Avatar and intro */}
            <div className="mb-8 flex items-start gap-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.4
                }}
                className="relative flex-shrink-0"
              >
                {avatarUrl ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-sm animate-pulse-glow" />
                    <Image
                      src={avatarUrl}
                      alt={name}
                      width={100}
                      height={100}
                      className="relative rounded-full object-cover ring-4 ring-background"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-sm" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
                      {name.charAt(0)}
                    </div>
                  </div>
                )}
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background bg-green-500">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                </span>
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold">{name}</h3>
                {title && <p className="text-primary">{title}</p>}
              </div>
            </div>

            {/* Bio with animated border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group relative mb-8 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="relative text-md leading-relaxed text-muted-foreground">
                {shortBio}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8 grid grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="group text-center"
                  >
                    <div className="mb-2 flex justify-center">
                      <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/about">
                <Button
                  variant="outline"
                  className="group relative overflow-hidden border-primary/20 px-6 py-3 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Learn more about me
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-primary/10 to-accent/10 transition-transform duration-300 group-hover:translate-y-0" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Feature cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-transparent hover:shadow-xl"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />

                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} style={{ padding: "1px" }}>
                    <div className="h-full w-full rounded-2xl bg-card" />
                  </div>

                  <div className="relative flex items-start gap-5">
                    {/* Icon with gradient background */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>

                    <div className="flex-1">
                      <h4 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
                      <ArrowRight className={`h-5 w-5 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
