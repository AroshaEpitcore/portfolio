"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderKanban, Mail, Eye, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  projectsCount: number;
  skillsCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
}

export function StatsCards({
  projectsCount,
  skillsCount,
  messagesCount,
  unreadMessagesCount,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Projects",
      value: projectsCount,
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Skills",
      value: skillsCount,
      icon: Wrench,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Messages",
      value: messagesCount,
      icon: Mail,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Unread Messages",
      value: unreadMessagesCount,
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
