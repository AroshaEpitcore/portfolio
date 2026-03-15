"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, FolderKanban, Plus, BookOpen, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/admin/stats-cards";
import { formatDate } from "@/lib/utils";
import type { Project, ContactSubmission } from "@/types/database";

interface AdminDashboardProps {
  stats: {
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
  };
  recentMessages: ContactSubmission[];
  recentProjects: Project[];
}

export function AdminDashboard({ stats, recentMessages, recentProjects }: AdminDashboardProps) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{greeting} 👋</h1>
            <p className="mt-1 text-muted-foreground">
              Here&apos;s an overview of your portfolio content.
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Content Overview</h2>
        <StatsCards {...stats} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
          <Link href="/admin/blog">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" /> New Blog Post
            </Button>
          </Link>
          <Link href="/admin/achievements">
            <Button variant="outline" className="gap-2">
              <Trophy className="h-4 w-4" /> Add Achievement
            </Button>
          </Link>
          <Link href="/admin/team">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" /> Add Team Member
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" />
                Recent Messages
                {stats.unreadMessagesCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                    {stats.unreadMessagesCount} new
                  </span>
                )}
              </CardTitle>
              <Link href="/admin/contact">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentMessages.length > 0 ? (
                <div className="space-y-2">
                  {recentMessages.map((message) => (
                    <div key={message.id}
                      className={`flex items-start justify-between gap-4 rounded-lg border p-3 transition-colors ${
                        !message.is_read ? "border-primary/20 bg-primary/5" : "border-border"
                      }`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{message.name}</p>
                          {!message.is_read && (
                            <Badge variant="default" className="h-4 px-1.5 text-[10px]">New</Badge>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{message.subject}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground/60">{formatDate(message.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Mail className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderKanban className="h-4 w-4" />
                Recent Projects
              </CardTitle>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <div className="space-y-2">
                  {recentProjects.map((project) => (
                    <div key={project.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{project.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(project.created_at)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {project.is_featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                        <Badge variant={project.is_published ? "default" : "outline"} className="text-xs">
                          {project.is_published ? "Live" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderKanban className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No projects yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
