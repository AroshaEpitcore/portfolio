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
  MapPin,
  Star,
  Rocket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LampSection } from "@/components/ui/lamp";
import { SkillBentoItem } from "@/components/ui/bento-grid";
import { formatDateRange } from "@/lib/utils";
import type { Profile, Experience, Skill } from "@/types/database";

interface AboutPageProps {
  profile?: Profile;
  experiences?: Experience[];
  skills?: Skill[];
}

const iconMap: { [key: string]: React.ElementType } = {
  code: Code2,
};

// Placeholder data
const placeholderProfile: Partial<Profile> = {
  name: "John Doe",
  title: "Full Stack Developer",
  bio: "I'm a passionate full-stack developer with over 5 years of experience building web applications. I specialize in React, Node.js, and cloud technologies. I love creating elegant solutions to complex problems and am always eager to learn new technologies.\n\nWhen I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities.",
  avatar_url: undefined,
  resume_url: "#",
};

const placeholderExperiences: Partial<Experience>[] = [
  {
    id: "1",
    company: "Tech Company",
    position: "Senior Full Stack Developer",
    description:
      "Led development of multiple web applications using React and Node.js. Mentored junior developers and implemented CI/CD pipelines.",
    start_date: "2022-01-01",
    end_date: null,
    is_current: true,
  },
  {
    id: "2",
    company: "Digital Agency",
    position: "Full Stack Developer",
    description:
      "Built custom web solutions for clients across various industries. Worked with React, Vue.js, and Python.",
    start_date: "2020-03-01",
    end_date: "2021-12-31",
    is_current: false,
  },
  {
    id: "3",
    company: "Startup Inc",
    position: "Junior Developer",
    description:
      "Developed frontend features and learned backend development. Contributed to the company's main product.",
    start_date: "2018-06-01",
    end_date: "2020-02-28",
    is_current: false,
  },
];

const stats = [
  { label: "Years Experience", value: "5+", icon: Star },
  { label: "Projects Completed", value: "30+", icon: Rocket },
  { label: "Happy Clients", value: "20+", icon: Users },
];

export function AboutPage({ profile, experiences, skills }: AboutPageProps) {
  const displayProfile = profile || placeholderProfile;
  const displayExperiences =
    experiences && experiences.length > 0 ? experiences : placeholderExperiences;

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
                {displayProfile.avatar_url ? (
                  <Image
                    src={displayProfile.avatar_url}
                    alt={displayProfile.name || "Profile"}
                    width={200}
                    height={200}
                    className="relative rounded-2xl object-cover ring-2 ring-primary/30"
                  />
                ) : (
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-6xl font-bold text-white shadow-lg">
                    {displayProfile.name?.charAt(0)}
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
                  {displayProfile.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-semibold text-transparent"
                >
                  {displayProfile.title}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-6 flex items-center justify-center gap-4 text-muted-foreground md:justify-start"
                >
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    San Francisco, CA
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="prose prose-sm dark:prose-invert"
                >
                  {displayProfile.bio?.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
                {displayProfile.resume_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-6"
                  >
                    <a
                      href={displayProfile.resume_url}
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

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card/60 p-5 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
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
      </section>

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

      {/* Education Section */}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">
                  Bachelor of Science in Computer Science
                </h3>
                <p className="font-medium text-primary">University of Technology</p>
                <p className="text-sm text-muted-foreground">2014 - 2018</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
