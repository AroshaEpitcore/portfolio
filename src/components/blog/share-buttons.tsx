"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, MessageCircle, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const buttons = [
    {
      label: "Share on X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      color: "hover:bg-black/10 hover:text-black dark:hover:bg-white/10 dark:hover:text-white",
    },
    {
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      color: "hover:bg-[#0077b5]/10 hover:text-[#0077b5]",
    },
    {
      label: "Share on WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      color: "hover:bg-green-500/10 hover:text-green-500",
    },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-xs text-muted-foreground">Share:</span>
      {buttons.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all ${color}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        type="button"
        title="Copy link"
        onClick={copyLink}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Link2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
