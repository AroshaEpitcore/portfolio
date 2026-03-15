"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Briefcase,
  Calendar,
  Code2,
  Download,
  GraduationCap,
  Award,
  MapPin,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { formatDateRange } from "@/lib/utils";
import type { Profile, Experience, Skill, Education } from "@/types/database";

interface AboutPageProps {
  profile?: Profile;
  experiences?: Experience[];
  skills?: Skill[];
  education?: Education[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export function AboutPage({ profile, experiences, skills, education }: AboutPageProps) {
  if (!profile) return null;

  const displayExperiences = experiences ?? [];
  const displayEducation = education ?? [];

  // Group skills by category
  const skillsByCategory = (skills ?? []).reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <PageHero badge="About Me" title="Who" titleAccent="I Am" description="Get to know me better — my background, experience, and what drives me." />

      {/* ── Profile ──────────────────────────────────────────────── */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl"
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            {/* Subtle bg glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />

            <div className="relative grid gap-8 p-8 md:grid-cols-[auto_1fr] md:gap-12 md:p-12">
              {/* Avatar column */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-40 blur-md" />
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.name || "Profile"}
                      width={160}
                      height={160}
                      className="relative h-40 w-40 rounded-2xl object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-5xl font-bold text-white">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                  {/* Online dot */}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-green-500" />
                </div>

                {/* Quick chips */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Sri Lanka
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Available for work
                  </span>
                </div>
              </div>

              {/* Info column */}
              <div>
                <h1 className="mb-1 text-3xl font-bold">{profile.name}</h1>
                <p className="mb-5 bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-semibold text-transparent">
                  {profile.title}
                </p>
                <div className="mb-6 space-y-2">
                  {profile.bio?.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">{para}</p>
                  ))}
                </div>

                {/* Stats row */}
                <div className="mb-7 grid grid-cols-3 gap-4 border-y border-border/50 py-5">
                  {[
                    { value: "3+", label: "Years Exp." },
                    { value: "50+", label: "Projects" },
                    { value: "100%", label: "Satisfaction" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 hover:opacity-90">
                      <Download className="h-4 w-4" />
                      Download Resume
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────────────── */}
      {displayExperiences.length > 0 && (
        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/30 to-muted/0" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="mb-12"
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
            <div className="relative pl-6 sm:pl-8">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-primary via-accent/50 to-transparent" />

              <div className="space-y-8">
                {displayExperiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className="absolute -left-6 sm:-left-8 top-5 flex h-5 w-5 -translate-x-1/2 items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    </div>

                    <div className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
                      {/* Top accent on hover */}
                      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-semibold">{exp.position}</h3>
                          <p className="text-sm font-medium text-primary">{exp.company}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateRange(exp.start_date || "", exp.is_current ? null : exp.end_date)}
                          {exp.is_current && (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Current
                            </span>
                          )}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Education ────────────────────────────────────────────── */}
      {displayEducation.length > 0 && (
        <section className="relative py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                  <GraduationCap className="h-4 w-4 text-accent" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Education</span>
              </div>
              <h2 className="text-3xl font-bold">Academic Background</h2>
              <p className="mt-2 text-sm text-muted-foreground">My educational qualifications and academic achievements.</p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {displayEducation.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Header */}
                  <div className="mb-4 flex items-start gap-4">
                    {edu.logo_url ? (
                      <img src={edu.logo_url} alt={edu.institution}
                        className="h-12 w-12 flex-shrink-0 rounded-xl object-contain ring-1 ring-border p-1" />
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight text-sm">{edu.degree}</h3>
                      {edu.field_of_study && (
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.field_of_study}</p>
                      )}
                    </div>
                  </div>

                  <p className="mb-3 text-sm font-medium text-primary">{edu.institution}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateRange(edu.start_date, edu.is_current ? null : edu.end_date)}
                    </span>
                    {edu.is_current && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Studying
                      </span>
                    )}
                    {edu.grade && (
                      <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 font-medium text-yellow-600 ring-1 ring-yellow-500/20 dark:text-yellow-400">
                        <Award className="h-3 w-3" /> {edu.grade}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{edu.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Skills ───────────────────────────────────────────────── */}
      {skills && skills.length > 0 && (
        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/30 to-muted/0" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Skills</span>
              </div>
              <h2 className="text-3xl font-bold">Technical Skills</h2>
              <p className="mt-2 text-sm text-muted-foreground">Technologies and tools I work with regularly.</p>
            </motion.div>

            {Object.keys(skillsByCategory).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(skillsByCategory).map(([category, catSkills], ci) => (
                  <motion.div
                    key={category}
                    custom={ci}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {catSkills.map((skill) => (
                        <SkillPill key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Flat pill grid if no categories */
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="flex flex-wrap gap-2.5"
              >
                {skills.map((skill) => (
                  <SkillPill key={skill.id} skill={skill} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function SkillPill({ skill }: { skill: Skill }) {
  const level = skill.proficiency ?? 0;
  const levelLabel =
    level >= 90 ? "Expert" : level >= 70 ? "Advanced" : level >= 50 ? "Intermediate" : "Beginner";
  const levelColor =
    level >= 90
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20"
      : level >= 70
      ? "bg-primary/10 text-primary ring-primary/20"
      : level >= 50
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20"
      : "bg-muted text-muted-foreground ring-border";

  return (
    <div className="group flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3.5 py-2 text-sm shadow-sm transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <Code2 className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
      <span className="font-medium">{skill.name}</span>
      {level > 0 && (
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ${levelColor}`}>
          {levelLabel}
        </span>
      )}
    </div>
  );
}
