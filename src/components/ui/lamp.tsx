"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-[55vh] w-full flex-col items-center justify-center overflow-hidden bg-background",
        className
      )}
    >
      {/* ── Glow layer — absolute so it never displaces content ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Left conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="bg-gradient-conic absolute inset-auto right-1/2 top-0 h-56 w-[30rem] overflow-visible from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right conic beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="bg-gradient-conic absolute inset-auto left-1/2 top-0 h-56 w-[30rem] from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Background blurs / washes */}
        <div className="absolute left-0 right-0 top-1/4 h-48 scale-x-150 bg-background blur-2xl" />
        <div className="absolute left-0 right-0 top-1/4 z-50 h-48 bg-transparent opacity-10 backdrop-blur-md" />

        {/* Primary glow orb */}
        <div className="absolute left-1/2 top-0 z-50 h-36 w-[28rem] -translate-x-1/2 rounded-full bg-primary opacity-50 blur-3xl" />

        {/* Soft inner glow */}
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 z-30 h-36 w-64 -translate-x-1/2 translate-y-[-4rem] rounded-full bg-primary/80 blur-2xl"
        />

        {/* Horizontal beam line */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 z-50 h-0.5 w-[30rem] -translate-x-1/2 translate-y-[-5rem] bg-primary"
        />

        {/* Background wash to hide top overflow */}
        <div className="absolute left-0 right-0 top-0 z-40 h-32 bg-background" />
      </div>

      {/* ── Content — normal flow, always below glow, always below navbar ── */}
      <div className="relative z-50 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

export const LampSection = ({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) => {
  return (
    <LampContainer className={className}>
      <motion.h2
        initial={{ opacity: 0.5, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="mt-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="mt-4 max-w-2xl text-center text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </LampContainer>
  );
};
