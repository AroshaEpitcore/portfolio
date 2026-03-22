"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  User,
  FolderKanban,
  Mail,
  Github,
  Linkedin,
  MessageCircle,
  BookOpen,
  FileText,
  FilePen,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "CV Generator", href: "/cv-generator", icon: FileText },
  { name: "Cover Letter", href: "/cover-letter", icon: FilePen },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/AroshaRavishan", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/arosha-ravishan-89b459247/",
    label: "LinkedIn",
  },
  { icon: MessageCircle, href: "https://wa.me/94762946381", label: "WhatsApp" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    function handleClick() {
      setShowUserMenu(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showUserMenu]);

  // Check Supabase auth state
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user ?? null);
      setAuthLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthUser(null);
    setShowUserMenu(false);
  }

  const userInitial = authUser
    ? (
        authUser.user_metadata?.full_name ||
        authUser.email ||
        "U"
      )
        .charAt(0)
        .toUpperCase()
    : "";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/85 shadow-sm backdrop-blur-lg border-b border-border/40"
            : "bg-background/20 backdrop-blur-md border-b border-border/10"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent"
            >
              Portfolio
            </motion.span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden absolute left-1/2 -translate-x-1/2 items-center space-x-1 md:flex">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-primary to-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Social Icons, Theme Toggle & Auth - Right */}
          <div className="hidden items-center space-x-3 md:flex">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md hover:shadow-primary/20"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
            <div className="mx-2 h-6 w-px bg-border" />
            <ThemeToggle />

            {/* Auth section */}
            {authLoaded && (
              <>
                {authUser ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu((v) => !v);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 pl-1 pr-2 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {userInitial}
                      </span>
                      <span className="max-w-[80px] truncate text-muted-foreground">
                        {authUser.user_metadata?.full_name ||
                          authUser.email?.split("@")[0]}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 z-50 min-w-[180px] rounded-xl border border-border bg-card p-2 shadow-xl"
                        >
                          <div className="mb-2 border-b border-border pb-2 px-2">
                            <p className="text-xs font-medium truncate">
                              {authUser.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {authUser.email}
                            </p>
                          </div>
                          <Link
                            href="/cv-generator"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            CV Generator
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-500/10"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      size="sm"
                      className="gap-1.5 bg-gradient-to-r from-primary to-accent text-white text-xs hover:opacity-90"
                    >
                      <User className="h-3.5 w-3.5" />
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-lg md:hidden"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Auth */}
              {authLoaded && (
                <div className="mt-2 border-t border-border pt-3">
                  {authUser ? (
                    <div className="px-4 py-2">
                      <p className="mb-1 text-xs text-muted-foreground">
                        Signed in as{" "}
                        <span className="font-medium text-foreground">
                          {authUser.email}
                        </span>
                      </p>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-2">
                      <Link href="/auth/login">
                        <Button
                          size="sm"
                          className="w-full gap-1.5 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                        >
                          <User className="h-4 w-4" />
                          Login / Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Social Links */}
              <div className="mt-4 flex items-center justify-center gap-4 border-t border-border pt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
