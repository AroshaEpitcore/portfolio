"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Briefcase,
  MessageSquare,
  Star,
  ArrowRight,
  Layers,
  Trophy,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ── Nav structure ────────────────────────────────────────────────────────────

const mainLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Blog", href: "/blog", icon: BookOpen },
];

const megaMenu = {
  label: "Services",
  icon: Layers,
  featured: [
    {
      name: "CV / Resume Generator",
      href: "/cv-generator",
      icon: FileText,
      description: "Build a professional ATS-friendly PDF résumé in minutes.",
      badge: "Free",
      badgeColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      name: "Cover Letter Generator",
      href: "/cover-letter",
      icon: FilePen,
      description: "Create a tailored cover letter with a professional letterhead.",
      badge: "Free",
      badgeColor: "bg-emerald-500/10 text-emerald-600",
    },
  ],
  links: [
    { name: "All Services", href: "/services", icon: Briefcase, description: "Web dev, UI/UX, API and more" },
    { name: "Achievements", href: "/achievements", icon: Trophy, description: "Certifications, awards & credentials" },
    { name: "GitHub", href: "/github", icon: Code2, description: "Open-source repos and contributions" },
    { name: "Testimonials", href: "/testimonials", icon: Star, description: "Leave a review or read client feedback" },
    { name: "Contact", href: "/contact", icon: MessageSquare, description: "Get in touch for a project quote" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/AroshaRavishan", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/arosha-ravishan-89b459247/", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://wa.me/94762946381", label: "WhatsApp" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = () => setShowUserMenu(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showUserMenu]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user ?? null);
      setAuthLoaded(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthLoaded(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => () => { if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current); }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthUser(null);
    setShowUserMenu(false);
  }

  const userInitial = authUser
    ? (authUser.user_metadata?.full_name || authUser.email || "U").charAt(0).toUpperCase()
    : "";

  // Is any services-group path active?
  const servicesActive = ["/services", "/cv-generator", "/cover-letter", "/testimonials", "/contact", "/achievements", "/github"].includes(pathname);

  const openMega = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaOpen(false), 120);
  };

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

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent"
            >
              Portfolio
            </motion.span>
          </Link>

          {/* Desktop nav — center */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {mainLinks.map((item, index) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div layoutId="navbar-indicator"
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-primary to-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Services mega menu trigger */}
            <motion.div
              ref={megaRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mainLinks.length * 0.07 }}
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                  servicesActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {megaMenu.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", megaOpen && "rotate-180")} />
                {servicesActive && (
                  <motion.div layoutId="navbar-indicator"
                    className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-primary to-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>

              {/* Mega menu panel */}
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[660px] rounded-2xl border border-border bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur-xl overflow-hidden"
                  >
                    {/* Top accent line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                    <div className="grid grid-cols-5 gap-0">
                      {/* Featured tools — left 3 cols */}
                      <div className="col-span-3 p-5 border-r border-border/60">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Free Tools</p>
                        <div className="space-y-2">
                          {megaMenu.featured.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                              <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                                className={cn(
                                  "group flex items-start gap-3 rounded-xl p-3 transition-colors",
                                  active ? "bg-primary/10" : "hover:bg-muted/60"
                                )}
                              >
                                <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-primary/20" : "bg-emerald-500/10 group-hover:bg-emerald-500/15")}>
                                  <Icon className={cn("h-4.5 w-4.5", active ? "text-primary" : "text-emerald-600")} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>{item.name}</p>
                                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", item.badgeColor)}>{item.badge}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-snug">{item.description}</p>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-1 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick links — right 2 cols */}
                      <div className="col-span-2 p-5">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Pages</p>
                        <div className="space-y-1">
                          {megaMenu.links.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                              <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                                className={cn(
                                  "group flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors",
                                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                )}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                <div>
                                  <p className="text-xs font-medium">{item.name}</p>
                                  <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right side — social, theme, auth */}
          <div className="hidden items-center space-x-3 md:flex shrink-0">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.07 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md hover:shadow-primary/20"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
            <div className="mx-1 h-6 w-px bg-border" />
            <ThemeToggle />

            {authLoaded && (
              <>
                {authUser ? (
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowUserMenu((v) => !v); }}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 pl-1 pr-2 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{userInitial}</span>
                      <span className="max-w-[80px] truncate text-muted-foreground">{authUser.user_metadata?.full_name || authUser.email?.split("@")[0]}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 z-50 min-w-[180px] rounded-xl border border-border bg-card p-2 shadow-xl"
                        >
                          <div className="mb-2 border-b border-border pb-2 px-2">
                            <p className="text-xs font-medium truncate">{authUser.user_metadata?.full_name || "User"}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{authUser.email}</p>
                          </div>
                          <Link href="/cv-generator" onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <FileText className="h-3.5 w-3.5" /> CV Generator
                          </Link>
                          <button onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-500/10">
                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary to-accent text-white text-xs hover:opacity-90">
                      <User className="h-3.5 w-3.5" /> Login
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-lg md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {/* Main links */}
              {mainLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    <Link href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" /> {item.name}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Services accordion */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: mainLinks.length * 0.05 }}>
                <button
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    servicesActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-3"><Layers className="h-5 w-5" /> Services</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                        {/* Featured tools */}
                        {megaMenu.featured.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.href} href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className={cn("ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium", item.badgeColor)}>{item.badge}</span>
                              </div>
                            </Link>
                          );
                        })}
                        {/* Quick links */}
                        {megaMenu.links.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link key={item.href} href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Mobile Auth */}
              {authLoaded && (
                <div className="mt-2 border-t border-border pt-3">
                  {authUser ? (
                    <div className="px-4 py-2">
                      <p className="mb-1 text-xs text-muted-foreground">
                        Signed in as <span className="font-medium text-foreground">{authUser.email}</span>
                      </p>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-500/10">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-2">
                      <Link href="/auth/login">
                        <Button size="sm" className="w-full gap-1.5 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
                          <User className="h-4 w-4" /> Login / Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile social */}
              <div className="flex items-center justify-center gap-4 border-t border-border pt-4 pb-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      aria-label={social.label}>
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
