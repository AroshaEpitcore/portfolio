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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LampSection } from "@/components/ui/lamp";
import { SkillBentoItem } from "@/components/ui/bento-grid";
import { formatDateRange } from "@/lib/utils";
import type { Profile, Experience, Skill, Education } from "@/types/database";

interface AboutPageProps {
  profile?: Profile;
  experiences?: Experience[];
  skills?: Skill[];
  education?: Education[];
}

const iconMap: { [key: string]: React.ElementType } = {
  code: Code2,
};

export function AboutPage({ profile, experiences, skills, education }: AboutPageProps) {
  if (!profile) return null;

  const displayExperiences = experiences ?? [];
  const displayEducation = education ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section — touches navbar */}
      <LampSection title="About Me" description="Get to know me better" className="pt-16" />

      {/* Profile Section */}
      <section className="relative -mt-32 pb-24">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-primary/20 bg-card/80 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm"
          >
            {/* Gradient accent top bar */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex-shrink-0"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-30 blur-sm" />
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name || "Profile"}
                    width={200}
                    height={200}
                    className="relative rounded-2xl object-cover ring-2 ring-primary/30"
                  />
                ) : (
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-6xl font-bold text-white shadow-lg">
                    {profile.name?.charAt(0)}
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-2 text-3xl font-bold"
                >
                  {profile.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-semibold text-transparent"
                >
                  {profile.title}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="prose prose-sm dark:prose-invert"
                >
                  {profile.bio?.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
                {profile.resume_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-6"
                  >
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:opacity-90">
                        <Download className="h-4 w-4" />
                        Download Resume
                      </Button>
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Experience Section */}
      {displayExperiences.length > 0 && <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
              Experience
            </span>
            <h2 className="mb-4 text-3xl font-bold">Work History</h2>
            <p className="text-muted-foreground">
              My professional journey and the companies I&apos;ve worked with.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line — gradient */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2 md:-ml-px" />

            {displayExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative mb-8 flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-4 -ml-2 flex h-4 w-4 items-center justify-center md:left-1/2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shadow-md shadow-primary/30" />
                  <div className="absolute h-8 w-8 animate-ping rounded-full bg-primary/10" />
                </div>

                {/* Content */}
                <div
                  className={`ml-12 w-full md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">{exp.position}</h3>
                    </div>
                    <p className="mb-2 font-medium text-primary">{exp.company}</p>
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDateRange(
                          exp.start_date || "",
                          exp.is_current ? null : exp.end_date
                        )}
                      </span>
                      {exp.is_current && (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>}

      {/* Education Section */}
      {displayEducation.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
                Education
              </span>
              <h2 className="mb-4 text-3xl font-bold">Academic Background</h2>
              <p className="text-muted-foreground">
                My educational qualifications and academic achievements.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2 md:-ml-px" />

              {displayEducation.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative mb-8 flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 -ml-2 flex h-4 w-4 items-center justify-center md:left-1/2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shadow-md shadow-primary/30" />
                    <div className="absolute h-8 w-8 animate-ping rounded-full bg-primary/10" />
                  </div>

                  {/* Content */}
                  <div className={`ml-12 w-full md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      <div className="mb-3 flex items-start gap-3">
                        {edu.logo_url ? (
                          <img src={edu.logo_url} alt={edu.institution}
                            className="h-10 w-10 flex-shrink-0 rounded-lg object-contain ring-1 ring-border" />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold leading-tight">{edu.degree}</h3>
                          {edu.field_of_study && (
                            <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                          )}
                        </div>
                      </div>

                      <p className="mb-2 font-medium text-primary">{edu.institution}</p>

                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateRange(edu.start_date, edu.is_current ? null : edu.end_date)}</span>
                        </div>
                        {edu.is_current && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                            Studying
                          </span>
                        )}
                        {edu.grade && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600 ring-1 ring-yellow-500/20 dark:text-yellow-400">
                            <Award className="h-3 w-3" />
                            {edu.grade}
                          </span>
                        )}
                      </div>

                      {edu.description && (
                        <p className="text-sm text-muted-foreground">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
                Skills
              </span>
              <h2 className="mb-4 text-3xl font-bold">Technical Skills</h2>
              <p className="text-muted-foreground">
                Technologies and tools I work with.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {skills.map((skill, index) => {
                const IconComponent = iconMap[skill.icon || "code"] || Code2;
                return (
                  <SkillBentoItem
                    key={skill.id}
                    skill={skill.name}
                    proficiency={skill.proficiency}
                    icon={<IconComponent className="h-6 w-6" />}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
