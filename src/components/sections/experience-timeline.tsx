"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const section = sectionRef.current;
    if (!line || !section) return;

    // Animate the fill line from 0 height to full height driven by scroll
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  if (!experiences.length) return null;

  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/30 to-muted/0" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</span>
          </div>
          <h2 className="text-3xl font-bold">Work History</h2>
          <p className="mt-2 text-sm text-muted-foreground">My professional journey and the companies I&apos;ve worked with.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Background track */}
          <div className="absolute left-5 top-0 h-full w-px bg-border/60 sm:left-7" />
          {/* Animated fill line */}
          <div
            ref={lineRef}
            className="absolute left-5 top-0 h-full w-px origin-top bg-gradient-to-b from-primary via-accent to-primary/20 sm:left-7"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="space-y-6 pl-14 sm:pl-20">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[3.25rem] top-6 sm:-left-[4.25rem]">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 + 0.2 }}
                    className="relative flex h-10 w-10 items-center justify-center"
                  >
                    {/* Pulse ring for current */}
                    {exp.is_current && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/30" />
                    )}
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      exp.is_current
                        ? "border-green-500 bg-green-500/10"
                        : "border-primary bg-primary/10"
                    }`}>
                      <Briefcase className={`h-4 w-4 ${exp.is_current ? "text-green-500" : "text-primary"}`} />
                    </div>
                  </motion.div>
                </div>

                {/* Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
                  {/* Hover top glow */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* Side accent */}
                  <div className={`absolute inset-y-0 left-0 w-0.5 transition-opacity duration-300 ${
                    exp.is_current
                      ? "bg-green-500 opacity-100"
                      : "bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100"
                  }`} />

                  <div className="p-6">
                    {/* Top row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-semibold leading-tight">{exp.position}</h3>
                        <p className="mt-0.5 text-sm font-medium text-primary">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatDateRange(exp.start_date ?? "", exp.is_current ? null : exp.end_date)}
                        </span>
                        {exp.is_current && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
