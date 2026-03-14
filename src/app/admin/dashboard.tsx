"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, FolderKanban, Plus } from "lucide-react";
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
  };
  recentMessages: ContactSubmission[];
  recentProjects: Project[];
}

export function AdminDashboard({
  stats,
  recentMessages,
  recentProjects,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </motion.div>

      {/* Stats */}
      <StatsCards
        projectsCount={stats.projectsCount}
        skillsCount={stats.skillsCount}
        messagesCount={stats.messagesCount}
        unreadMessagesCount={stats.unreadMessagesCount}
      />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
        <Link href="/admin/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
        <Link href="/admin/skills">
          <Button variant="outline">Manage Skills</Button>
        </Link>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <Link href="/admin/contact">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{message.name}</p>
                          {!message.is_read && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No messages yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.is_featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        <Badge
                          variant={project.is_published ? "default" : "outline"}
                        >
                          {project.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No projects yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
