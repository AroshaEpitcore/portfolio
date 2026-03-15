"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, User, Briefcase, BookOpen, Mail, Github, Wrench, Trophy,
  ArrowRight, Search, Command, X,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigate = useCallback((href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  }, [router]);

  const items: CommandItem[] = [
    { id: "home", label: "Home", description: "Back to landing page", icon: <Home className="h-4 w-4" />, group: "Pages", action: () => navigate("/"), keywords: "index landing" },
    { id: "about", label: "About", description: "Learn about me", icon: <User className="h-4 w-4" />, group: "Pages", action: () => navigate("/about"), keywords: "profile bio background" },
    { id: "projects", label: "Projects", description: "Browse my work", icon: <Briefcase className="h-4 w-4" />, group: "Pages", action: () => navigate("/projects"), keywords: "portfolio work case study" },
    { id: "services", label: "Services", description: "What I offer", icon: <Wrench className="h-4 w-4" />, group: "Pages", action: () => navigate("/services"), keywords: "hire freelance" },
    { id: "blog", label: "Blog", description: "Articles and write-ups", icon: <BookOpen className="h-4 w-4" />, group: "Pages", action: () => navigate("/blog"), keywords: "articles posts writing" },
    { id: "achievements", label: "Achievements", description: "Certifications & awards", icon: <Trophy className="h-4 w-4" />, group: "Pages", action: () => navigate("/achievements"), keywords: "certs awards" },
    { id: "github", label: "GitHub", description: "Open source repos", icon: <Github className="h-4 w-4" />, group: "Pages", action: () => navigate("/github"), keywords: "code repositories open source" },
    { id: "contact", label: "Contact", description: "Get in touch", icon: <Mail className="h-4 w-4" />, group: "Pages", action: () => navigate("/contact"), keywords: "email message hire" },
  ];

  const filtered = query.trim()
    ? items.filter(item =>
        [item.label, item.description, item.keywords].join(" ").toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Group filtered results
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(groups).flat();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatFiltered[selectedIndex]?.action();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <>
      {/* Trigger hint (bottom right) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur px-3 py-2 text-xs text-muted-foreground shadow-lg transition hover:border-primary/40 hover:text-foreground"
        aria-label="Open command palette"
      >
        <Command className="h-3 w-3" />
        <span>K</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-1/2 top-[20vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20"
              onKeyDown={onKeyDown}
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages, projects, blog..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="hidden rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">ESC</kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                {flatFiltered.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">No results for &quot;{query}&quot;</p>
                ) : (
                  Object.entries(groups).map(([group, groupItems]) => {
                    const groupStart = flatFiltered.indexOf(groupItems[0]);
                    return (
                      <div key={group} className="mb-1">
                        <p className="mb-1 px-2 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{group}</p>
                        {groupItems.map((item) => {
                          const idx = flatFiltered.indexOf(item);
                          const isSelected = idx === selectedIndex;
                          return (
                            <button
                              key={item.id}
                              data-idx={idx}
                              onClick={item.action}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                                isSelected ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                              }`}
                            >
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                isSelected ? "border-primary/30 bg-primary/10 text-primary" : "border-border/60 bg-muted/50 text-muted-foreground"
                              }`}>
                                {item.icon}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className={`block font-medium ${isSelected ? "text-foreground" : ""}`}>{item.label}</span>
                                {item.description && (
                                  <span className="block text-xs text-muted-foreground/70 truncate">{item.description}</span>
                                )}
                              </span>
                              {isSelected && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[10px] text-muted-foreground/60">
                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5">↑↓</kbd> navigate
                  <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5">↵</kbd> open
                </span>
                <span className="flex items-center gap-1"><Command className="h-3 w-3" /> K to toggle</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
