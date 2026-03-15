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
      // Start exit after 2.4s
      const t1 = setTimeout(() => setLeaving(true), 2400);
      // Fully remove after exit animation
      const t2 = setTimeout(() => setVisible(false), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Radial glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--hue), var(--saturation), 50%, 0.15), transparent 70%)",
            }}
          />

          {/* Top horizontal line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: "50%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={leaving
              ? { top: "0%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }
              : { scaleX: 1, opacity: 1, transition: { duration: 0.6, delay: 0.1, ease: "easeOut" } }
            }
          />

          {/* Bottom horizontal line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: "50%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={leaving
              ? { top: "100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }
              : { scaleX: 1, opacity: 1, transition: { duration: 0.6, delay: 0.1, ease: "easeOut" } }
            }
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={leaving
              ? { opacity: 0, y: -24, transition: { duration: 0.4, ease: "easeIn" } }
              : { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
            }
          >
            {/* Initials / logo mark */}
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-3xl font-bold text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={leaving
                ? { scale: 1.1, opacity: 0, transition: { duration: 0.3 } }
                : { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 } }
              }
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-transparent opacity-50 blur-sm" />
              <span className="relative font-[var(--font-bricolage)]">R</span>

              {/* Corner accents */}
              <span className="absolute -left-px -top-px h-3 w-3 rounded-tl-2xl border-l-2 border-t-2 border-primary" />
              <span className="absolute -right-px -top-px h-3 w-3 rounded-tr-2xl border-r-2 border-t-2 border-primary" />
              <span className="absolute -bottom-px -left-px h-3 w-3 rounded-bl-2xl border-b-2 border-l-2 border-primary" />
              <span className="absolute -bottom-px -right-px h-3 w-3 rounded-br-2xl border-b-2 border-r-2 border-primary" />
            </motion.div>

            {/* Name */}
            <div className="overflow-hidden">
              <motion.p
                className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                initial={{ y: 24 }}
                animate={leaving
                  ? { y: -24, transition: { duration: 0.3 } }
                  : { y: 0, transition: { duration: 0.4, delay: 0.45 } }
                }
              >
                Portfolio
              </motion.p>
            </div>

            {/* Loading bar */}
            <motion.div
              className="h-px w-32 overflow-hidden rounded-full bg-border/60"
              initial={{ opacity: 0 }}
              animate={leaving
                ? { opacity: 0 }
                : { opacity: 1, transition: { delay: 0.5 } }
              }
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
