"use client";

import Link from "next/link";
import { FileText, Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function CVPromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  if (dismissed || pathname === "/cv-generator") return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/20">
      {/* Subtle animated shimmer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-sm text-foreground/80 truncate">
            <span className="font-semibold text-foreground">New: </span>
            Build an ATS-optimized CV in minutes and download as PDF —{" "}
            <span className="hidden sm:inline">2 free generations, no account required upfront. </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/cv-generator"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20"
          >
            <FileText className="h-3 w-3" />
            Try it free
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
