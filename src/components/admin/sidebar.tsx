"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  ConciergeBell,
  Link2,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    name: "Skills",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    name: "Experience",
    href: "/admin/experience",
    icon: Briefcase,
  },
  {
    name: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: ConciergeBell,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    name: "Achievements",
    href: "/admin/achievements",
    icon: Trophy,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    name: "Team Members",
    href: "/admin/team",
    icon: Users,
  },
  {
    name: "Social Links",
    href: "/admin/social",
    icon: Link2,
  },
  {
    name: "Contact",
    href: "/admin/contact",
    icon: Mail,
  },
];

export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-card"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-bold text-transparent"
          >
            Admin Panel
          </motion.span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0")} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              View Site
            </motion.span>
          )}
        </Link>
      </div>
    </motion.aside>
  );
}
