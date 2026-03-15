"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Linkedin, Check, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ShareButtonProps {
  url?: string;       // defaults to current page URL
  title?: string;
  text?: string;
  className?: string;
  size?: "sm" | "md";
}

export function ShareButton({ url, title, text, className = "", size = "md" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getUrl = () => url ?? (typeof window !== "undefined" ? window.location.href : "");

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: getUrl() });
        return true;
      } catch { /* cancelled */ }
    }
    return false;
  };

  const handleToggle = async () => {
    // On mobile with Web Share API — share natively directly
    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && window.innerWidth < 768) {
      await handleNativeShare();
      return;
    }
    setOpen((v) => !v);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
    setOpen(false);
  };

  const shareOptions = [
    {
      label: "Copy Link",
      icon: copied ? Check : Link2,
      action: copyLink,
      className: "hover:text-primary",
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`, "_blank");
        setOpen(false);
      },
      className: "hover:text-blue-500",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent((title ? title + " " : "") + getUrl())}`, "_blank");
        setOpen(false);
      },
      className: "hover:text-green-500",
    },
  ];

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const btnSize = size === "sm"
    ? "h-8 px-3 text-xs gap-1.5"
    : "h-9 px-4 text-sm gap-2";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className={`inline-flex w-full items-center justify-center rounded-xl border border-border/50 bg-card/80 font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary ${btnSize}`}
      >
        <Share2 className={iconSize} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/10"
          >
            {shareOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted ${opt.className}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
