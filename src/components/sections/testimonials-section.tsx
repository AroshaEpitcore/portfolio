"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/types/database";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const items = testimonials ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">What Clients Say</h2>
          <p className="mt-3 text-muted-foreground">Feedback from people I&apos;ve worked with</p>
        </motion.div>

        <div className={`grid gap-6 ${
          items.length === 1 ? "max-w-lg mx-auto" :
          items.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" :
          "md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg ${
                item.is_featured
                  ? "border-primary/30 hover:border-primary/50 hover:shadow-primary/5"
                  : "border-border hover:border-primary/20"
              }`}
            >
              {/* Quote icon */}
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < item.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
                ))}
              </div>

              {/* Content */}
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {(item.role || item.company) && (
                    <p className="text-xs text-muted-foreground">
                      {[item.role, item.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
