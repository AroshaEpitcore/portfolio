"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("splash_seen");
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem("splash_seen", "1");
      const t1 = setTimeout(() => setLeaving(true), 1800);
      const t2 = setTimeout(() => setVisible(false), 2400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []);

  const letters = ["R", "A", "V", "I", "S", "H", "A", "N"];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Subtle radial glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 50% 50%, hsl(var(--primary) / 0.12), transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Name letter-by-letter */}
            <div className="flex items-center gap-[0.06em]">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-5xl font-bold tracking-tight text-foreground font-[var(--font-bricolage)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    leaving
                      ? { opacity: 0, y: -16, transition: { duration: 0.25, delay: i * 0.03, ease: "easeIn" } }
                      : { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.1 + i * 0.06, ease: "easeOut" } }
                  }
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Animated underline */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={
                leaving
                  ? { width: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
                  : { width: 200, opacity: 1, transition: { duration: 0.6, delay: 0.7, ease: "easeOut" } }
              }
            />

            {/* Tagline */}
            <motion.p
              className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={
                leaving
                  ? { opacity: 0, transition: { duration: 0.2 } }
                  : { opacity: 1, transition: { duration: 0.4, delay: 1.0 } }
              }
            >
              Portfolio
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
