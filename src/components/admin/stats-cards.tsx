"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban, Mail, Wrench, Trophy, ConciergeBell,
  BookOpen, Users, MessageSquare, Briefcase, MailOpen,
} from "lucide-react";

interface StatsCardsProps {
  projectsCount: number;
  skillsCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  achievementsCount: number;
  servicesCount: number;
  blogCount: number;
  teamCount: number;
  testimonialsCount: number;
  experiencesCount: number;
}

export function StatsCards(props: StatsCardsProps) {
  const stats = [
    {
      title: "Projects",
      value: props.projectsCount,
      icon: FolderKanban,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/projects",
    },
    {
      title: "Skills",
      value: props.skillsCount,
      icon: Wrench,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/skills",
    },
    {
      title: "Achievements",
      value: props.achievementsCount,
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      href: "/admin/achievements",
    },
    {
      title: "Services",
      value: props.servicesCount,
      icon: ConciergeBell,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      href: "/admin/services",
    },
    {
      title: "Blog Posts",
      value: props.blogCount,
      icon: BookOpen,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      href: "/admin/blog",
    },
    {
      title: "Team Members",
      value: props.teamCount,
      icon: Users,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      href: "/admin/team",
    },
    {
      title: "Testimonials",
      value: props.testimonialsCount,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      href: "/admin/testimonials",
    },
    {
      title: "Experiences",
      value: props.experiencesCount,
      icon: Briefcase,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      href: "/admin/experience",
    },
    {
      title: "Total Messages",
      value: props.messagesCount,
      icon: Mail,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/admin/contact",
    },
    {
      title: "Unread Messages",
      value: props.unreadMessagesCount,
      icon: MailOpen,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: "/admin/contact",
      highlight: props.unreadMessagesCount > 0,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={stat.href}>
              <div className={`group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                stat.highlight ? "border-red-500/30 bg-red-500/5" : "border-border hover:border-primary/30"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`mt-1.5 text-2xl font-bold ${stat.highlight ? "text-red-500" : "text-foreground"}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg p-2 ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                {/* hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-1 ring-primary/20 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
