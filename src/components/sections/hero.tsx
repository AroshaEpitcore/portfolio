"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRight, Download, Github, Linkedin, MessageCircle, MousePointer2 } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { GlowingButton, Button } from "@/components/ui/button";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 160;
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.004 + 0.002,
      offset: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      for (const s of stars) {
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * s.speed + s.offset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.85})`;
        ctx.shadowBlur = s.r > 1 ? 6 : 0;
        ctx.shadowColor = "rgba(180,180,255,0.8)";
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}


interface HeroProps {
  name?: string;
  title?: string;
  bio?: string;
  resumeUrl?: string;
  heroImageUrl?: string;
}

export function Hero({
  name = "John Doe",
  title = "Full Stack Developer",
  bio = "I build beautiful, performant, and accessible web experiences using modern technologies.",
  resumeUrl,
  heroImageUrl = "/me.png",
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Starfield */}
      <StarField />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[100px]" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--primary)"
      />


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

              {/* Job Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <p className="text-xl font-semibold text-muted-foreground sm:text-2xl lg:text-3xl">
                  {title}
                </p>
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0 mx-auto"
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
                  { icon: Github, href: "https://github.com/AroshaRavishan", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/arosha-ravishan-89b459247/", label: "LinkedIn" },
                  { icon: MessageCircle, href: "https://wa.me/94762946381", label: "WhatsApp" },
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

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 lg:order-2 relative flex items-center justify-center py-10"
            >
              {/* Deep glow behind everything */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-primary/40 via-accent/20 to-primary/40 blur-[90px] opacity-80" />
              </div>

              {/* Slow-spinning outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute h-[370px] w-[370px] sm:h-[430px] sm:w-[430px] rounded-full border border-dashed border-primary/30"
              />

              {/* Counter-spinning ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                className="absolute h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] rounded-full border border-primary/20"
              />

              {/* Pulsing glow ring */}
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl"
              />

              {/* Image circle frame */}
              <div className="relative z-10 rounded-full p-[3px] bg-gradient-to-br from-primary via-accent to-primary shadow-[0_0_40px_8px_hsl(var(--primary)/0.4)]">
                <div className="rounded-full overflow-hidden bg-background/10 backdrop-blur-sm">
                  <Image
                    src={heroImageUrl}
                    alt={name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-[260px] h-auto sm:w-[320px] lg:w-[380px] rounded-full"
                    priority
                  />
                </div>
              </div>

              {/* Orbiting bubbles */}
              {[
                { size: "h-4 w-4", color: "bg-primary", orbit: "h-[390px] w-[390px] sm:h-[460px] sm:w-[460px]", delay: 0, duration: 6 },
                { size: "h-3 w-3", color: "bg-accent", orbit: "h-[390px] w-[390px] sm:h-[460px] sm:w-[460px]", delay: 2, duration: 6 },
                { size: "h-2.5 w-2.5", color: "bg-primary/70", orbit: "h-[340px] w-[340px] sm:h-[410px] sm:w-[410px]", delay: 1, duration: 8 },
                { size: "h-2 w-2", color: "bg-accent/80", orbit: "h-[340px] w-[340px] sm:h-[410px] sm:w-[410px]", delay: 4, duration: 8 },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${b.orbit} rounded-full pointer-events-none`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay }}
                  style={{ transformOrigin: "center center" }}
                >
                  {/* Bubble sits at top of its orbit circle */}
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 ${b.size} rounded-full ${b.color} shadow-lg shadow-primary/50`}>
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/60 opacity-75" />
                  </div>
                </motion.div>
              ))}

              {/* Floating stat badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-1/4 z-20 flex items-center gap-2 rounded-2xl border border-primary/30 bg-card/80 px-3 py-2 backdrop-blur-md shadow-lg shadow-primary/10"
              >
                <span className="text-lg">💻</span>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">{title.split(" ").slice(0, Math.ceil(title.split(" ").length / 2)).join(" ")}</p>
                  <p className="text-muted-foreground">{title.split(" ").slice(Math.ceil(title.split(" ").length / 2)).join(" ")}</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-4 bottom-1/4 z-20 flex items-center gap-2 rounded-2xl border border-accent/30 bg-card/80 px-3 py-2 backdrop-blur-md shadow-lg shadow-accent/10"
              >
                <span className="text-lg">✨</span>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Available</p>
                  <p className="text-muted-foreground">for work</p>
                </div>
              </motion.div>
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
