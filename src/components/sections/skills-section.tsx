"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Code2,
  Database,
  Globe,
  Palette,
  Server,
  Smartphone,
  Terminal,
  Wrench,
  Sparkles,
  Zap,
  Layers,
  Cpu,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Skill } from "@/types/database";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillsSectionProps {
  skills?: Skill[];
}

const iconMap: { [key: string]: React.ElementType } = {
  code: Code2,
  database: Database,
  globe: Globe,
  palette: Palette,
  server: Server,
  smartphone: Smartphone,
  terminal: Terminal,
  wrench: Wrench,
};

const categoryIcons: { [key: string]: React.ElementType } = {
  frontend: Palette,
  backend: Server,
  tools: Wrench,
  mobile: Smartphone,
  other: Layers,
};

const categoryGradients: { [key: string]: string } = {
  frontend: "from-blue-500 to-cyan-500",
  backend: "from-green-500 to-emerald-500",
  tools: "from-orange-500 to-yellow-500",
  mobile: "from-purple-500 to-pink-500",
  other: "from-gray-500 to-slate-500",
};


const categoryLabels: { [key: string]: string } = {
  frontend: "Frontend Development",
  backend: "Backend Development",
  tools: "Tools & DevOps",
  mobile: "Mobile Development",
  other: "Other Skills",
};

const SkillCard = ({
  skill,
  index,
  categoryGradient,
}: {
  skill: Partial<Skill>;
  index: number;
  categoryGradient: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-30px" });

  useEffect(() => {
    if (!progressRef.current || !isInView) return;

    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: `${skill.proficiency}%`,
        duration: 1.2,
        delay: index * 0.1,
        ease: "power3.out",
      }
    );
  }, [isInView, skill.proficiency, index]);

  const IconComponent = iconMap[skill.icon || "code"] || Code2;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {/* Gradient background on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />

        {/* Icon and name */}
        <div className="relative mb-3 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${categoryGradient} shadow-md`}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{skill.name}</h4>
            <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            ref={progressRef}
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${categoryGradient}`}
            style={{ width: 0 }}
          />
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection = ({
  category,
  skills,
  index,
}: {
  category: string;
  skills: Partial<Skill>[];
  index: number;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const CategoryIcon = categoryIcons[category] || Layers;
  const gradient = categoryGradients[category] || categoryGradients.other;

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Category header */}
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
        >
          <CategoryIcon className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {categoryLabels[category] || category}
          </h3>
          <p className="text-xs text-muted-foreground">{skills.length} skills</p>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {skills.map((skill, skillIndex) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            index={skillIndex}
            categoryGradient={gradient}
          />
        ))}
      </div>
    </motion.div>
  );
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;
  return <SkillsSectionContent skills={skills} />;
}

function SkillsSectionContent({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Partial<Skill>[]>);

  const categoryOrder = ["frontend", "backend", "tools", "mobile", "other"];
  const sortedCategories = Object.keys(groupedSkills).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </motion.div>

      {/* Floating decorations and glow lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glow lines */}
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 0 }}
          className="absolute top-1/3 left-0 h-[1px] w-1/4 bg-gradient-to-r from-transparent via-accent/40 to-transparent rotate-1"
        />
        <motion.div
          initial={{ x: "200%", opacity: 0 }}
          animate={{ x: "-100%", opacity: [0, 0.4, 0.4, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 3 }}
          className="absolute top-2/3 right-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent -rotate-1"
        />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-[5%] top-[20%] text-primary/10"
        >
          <Cpu className="h-24 w-24" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute right-[10%] top-[30%] text-accent/10"
        >
          <Code2 className="h-20 w-20" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[20%] bottom-[20%] text-primary/10"
        >
          <Zap className="h-16 w-16" />
        </motion.div>

        {/* Glow circles */}
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[15%] h-28 w-28 rounded-full border border-primary/10"
        />
        <motion.div
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-[10%] h-20 w-20 rounded-full border border-accent/10"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Skills & Technologies</span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl"
          >
            <span className="text-foreground">Technical</span>{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-gradient">
              Expertise
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            A comprehensive toolkit of modern technologies and frameworks that I use
            to bring ideas to life.
          </motion.p>
        </div>

        {/* Skills by Category - 2 column layout on larger screens */}
        <div className="grid gap-12 lg:grid-cols-2">
          {sortedCategories.map((category, index) => (
            <CategorySection
              key={category}
              category={category}
              skills={groupedSkills[category]}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">
              Always learning and exploring new technologies
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
