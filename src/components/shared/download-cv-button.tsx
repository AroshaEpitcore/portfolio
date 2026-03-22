"use client";

import { useState } from "react";
import { FileDown, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadCVButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DownloadCVButton({
  className,
  variant = "default",
  size = "default",
}: DownloadCVButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handleDownload() {
    if (state === "loading") return;
    setState("loading");

    try {
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "cv.pdf";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setState("done");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("idle");
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={state === "loading"}
      className={cn(
        "gap-2 transition-all",
        variant === "default" &&
          "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 hover:opacity-90",
        className
      )}
    >
      {state === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating CV…
        </>
      ) : state === "done" ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-400" />
          Downloaded!
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Download CV
        </>
      )}
    </Button>
  );
}
