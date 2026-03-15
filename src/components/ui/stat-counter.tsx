"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string; // e.g. "3+", "50+", "100%", "4.9"
  label: string;
  duration?: number; // ms
  className?: string;
}

function parseValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: raw };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function StatCounter({ value, label, duration = 1600, className = "" }: StatCounterProps) {
  const { num, suffix } = parseValue(value);
  const isDecimal = num % 1 !== 0;

  const [display, setDisplay] = useState("0");
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    let startTime: number | null = null;
    let frame: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = eased * num;

      setDisplay(isDecimal ? current.toFixed(1) : Math.floor(current).toString());

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(isDecimal ? num.toFixed(1) : num.toString());
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [triggered, num, duration, isDecimal]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-foreground tabular-nums">
        {display}{suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
