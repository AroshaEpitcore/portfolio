"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Github, Linkedin, Twitter, MousePointer2 } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { GlowingButton, Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

// Static bright stars that are always visible
const staticStars = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 2,
  delay: Math.random() * 3,
}));

interface HeroProps {
  name?: string;
  title?: string;
  bio?: string;
  resumeUrl?: string;
  heroImageUrl?: string;
}

const roles = ["Full Stack Developer", "UI/UX Designer", "Problem Solver", "Creative Thinker"];

export function Hero({
  name = "John Doe",
  title = "Full Stack Developer",
  bio = "I build beautiful, performant, and accessible web experiences using modern technologies.",
  resumeUrl,
  heroImageUrl = "https://inversweb.com/product/html/virtuo/assets/images/banner/banner-user-image-one.png",
}: HeroProps) {
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[100px]"
        />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--primary)"
      />

      {/* Sparkles Background - smaller particles */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <SparklesCore
          id="hero-sparkles-large"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={40}
          particleColor="#ffffff"
          speed={0.5}
        />
      </div>

      <div className="absolute inset-0 h-full w-full pointer-events-none opacity-50">
        <SparklesCore
          id="hero-sparkles-medium"
          background="transparent"
          minSize={0.2}
          maxSize={0.8}
          particleDensity={60}
          particleColor="var(--primary)"
          speed={0.6}
        />
      </div>

      {/* Glowing lines design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal glow line 1 */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 0 }}
          className="absolute top-1/4 left-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent rotate-12"
        />
        {/* Diagonal glow line 2 */}
        <motion.div
          initial={{ x: "200%", opacity: 0 }}
          animate={{ x: "-100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-2/3 right-0 h-[1px] w-1/4 bg-gradient-to-r from-transparent via-accent/50 to-transparent -rotate-12"
        />
        {/* Vertical glow line */}
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "200%", opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
          className="absolute top-0 left-1/4 w-[1px] h-1/3 bg-gradient-to-b from-transparent via-primary/40 to-transparent"
        />
        {/* Curved glow arc */}
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-[300px] h-[300px] border border-primary/20 rounded-full"
          style={{ borderWidth: "1px" }}
        />
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1.02, 1, 1.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-10 w-[200px] h-[200px] border border-accent/15 rounded-full"
        />
      </div>

      {/* Static small stars */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {staticStars.map((star) => (
            <motion.circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size * 0.5}
              fill="#ffffff"
              filter="url(#star-glow)"
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 flex min-h-screen items-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Greeting Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-foreground">Available for work</span>
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="mb-4"
              >
                <span className="block text-xl font-medium text-muted-foreground sm:text-2xl">
                  Hi, I&apos;m
                </span>
                <span className="mt-2 block text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
                    {name}
                  </span>
                </span>
              </motion.h1>

              {/* Animated Role */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 h-10 overflow-hidden sm:h-12"
              >
                <motion.div
                  key={roleIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-xl font-semibold text-muted-foreground sm:text-2xl lg:text-3xl"
                >
                  {roles[roleIndex]}
                </motion.div>
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 mx-auto"
              >
                {bio}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center"
              >
                <Link href="/projects">
                  <GlowingButton className="group px-8 py-4 text-base">
                    <span className="flex items-center gap-2">
                      View My Work
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </GlowingButton>
                </Link>
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="group gap-2 border-primary/30 px-8 py-4 backdrop-blur-sm hover:border-primary hover:bg-primary/10">
                      <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                      Download Resume
                    </Button>
                  </a>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex items-center gap-4 lg:justify-start justify-center"
              >
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Image with Flashlight Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 lg:order-2 relative flex items-center justify-center"
            >
              {/* Flashlight/Glow Effects Behind Image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Main flashlight glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] lg:h-[550px] lg:w-[550px] rounded-full bg-gradient-to-tr from-primary/50 via-primary/30 to-accent/50 blur-[100px]"
                />
                {/* Secondary glow */}
                <motion.div
                  animate={{
                    scale: [1.05, 1, 1.05],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-accent/40 blur-[80px]"
                />
                {/* Bottom accent glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 h-[200px] w-[400px] sm:h-[250px] sm:w-[500px] rounded-full bg-primary/30 blur-[60px] translate-y-1/2"
                />
              </div>

              {/* Image container */}
              <div className="relative">
                {/* Outer glow ring */}
                <motion.div
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 bg-gradient-to-b from-primary/20 via-transparent to-accent/20 rounded-3xl blur-xl"
                />

                {/* Image */}
                <div className="relative h-[350px] w-[280px] sm:h-[450px] sm:w-[360px] lg:h-[550px] lg:w-[440px]">
                  <Image
                    src={heroImageUrl}
                    alt={name}
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority
                    unoptimized
                  />

                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-20 h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/50"
                />
                <motion.div
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -left-4 top-1/3 h-3 w-3 rounded-full bg-accent shadow-lg shadow-accent/50"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 bottom-1/3 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 left-0 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="absolute bottom-1/4 -left-6 h-3 w-3 rounded-full bg-primary/80 shadow-lg shadow-primary/30"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <MousePointer2 className="h-5 w-5 rotate-180" />
        </motion.a>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
