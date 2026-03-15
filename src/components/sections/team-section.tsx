"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Users } from "lucide-react";
import type { TeamMember } from "@/types/database";

interface Props {
  members?: TeamMember[];
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-primary/30 transition-opacity group-hover:opacity-100" />

      {/* Avatar */}
      <div className="relative mb-4">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-border transition-all duration-300 group-hover:ring-primary/30"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-border transition-all duration-300 group-hover:ring-primary/30">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-card">
          <span className="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
      <p className="mt-0.5 text-sm font-medium text-primary">{member.role}</p>

      {member.bio && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
      )}

      {/* Social */}
      {(member.linkedin_url || member.github_url) && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {member.linkedin_url && (
            <motion.a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${member.name} on LinkedIn`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-500"
            >
              <Linkedin className="h-4 w-4" />
            </motion.a>
          )}
          {member.github_url && (
            <motion.a
              href={member.github_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`${member.name} on GitHub`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </motion.a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function TeamSection({ members }: Props) {
  const active = members?.filter((m) => m.is_active);
  if (!active || active.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Users className="h-4 w-4" />
            The Team
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Meet the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              People
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Talented individuals who bring ideas to life together.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {active.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
