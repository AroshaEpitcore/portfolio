"use client";

import React, { useId, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  className?: string;
}

export const SparklesCore = ({
  id,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#fff",
  particleDensity = 100,
  className,
}: SparklesCoreProps) => {
  const generatedId = useId();
  const actualId = id || generatedId;

  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: particleDensity }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: (Math.random() * 2 + 1) / speed,
        delay: Math.random() * 2,
      }))
    );
  }, [particleDensity, maxSize, minSize, speed]);

  return (
    <div
      className={cn("relative h-full w-full", className)}
      style={{ background }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`glow-${actualId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill={particleColor}
            filter={`url(#glow-${actualId})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 1, 1, 0.3, 0],
              scale: [0, 0.5, 1, 1.2, 0.8, 0],
            }}
            transition={{
              duration: particle.duration * 1.5,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const Sparkles = ({
  children,
  className,
  sparklesClassName,
}: {
  children: React.ReactNode;
  className?: string;
  sparklesClassName?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("absolute inset-0 z-0", sparklesClassName)}>
        <SparklesCore
          particleColor="var(--primary)"
          particleDensity={50}
          minSize={0.4}
          maxSize={1.5}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
