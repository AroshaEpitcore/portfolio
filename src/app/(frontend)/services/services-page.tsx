"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, ArrowRight, Briefcase, FileText, FilePen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import type { Service } from "@/types/database";

const TOOL_SERVICES = [
  {
    id: "cv-generator",
    title: "CV / Resume Generator",
    description: "Build a professional, ATS-friendly CV in minutes. Choose fonts, accent colours, and section layouts — then download as a pixel-perfect PDF.",
    icon: FileText,
    href: "/cv-generator",
    badge: "Free Tool",
    badgeColor: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    features: [
      "2 free PDF generations",
      "Multiple font families",
      "Custom accent colours",
      "Compact / Normal / Spacious spacing",
      "Auto read-time & tag detection",
      "Instant PDF download",
    ],
  },
  {
    id: "cover-letter",
    title: "Cover Letter Generator",
    description: "Create a tailored, professional cover letter for any job application. Fill in your details, paste the role description, and get a polished PDF instantly.",
    icon: FilePen,
    href: "/cover-letter",
    badge: "Free Tool",
    badgeColor: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    features: [
      "Unlimited generations",
      "Job-specific personalisation",
      "Professional letterhead layout",
      "Matching accent colours",
      "Instant PDF download",
      "Works alongside the CV tool",
    ],
  },
] as const;

interface ServicesPageProps {
  services?: Service[];
}

export function ServicesPage({ services }: ServicesPageProps) {
  const displayServices = services ?? [];
  const featured = displayServices.filter((s) => s.is_featured);
  const standard = displayServices.filter((s) => !s.is_featured);

  return (
    <div className="min-h-screen">
      <PageHero badge="Services" title="What I" titleAccent="Offer" description="From concept to deployment — here's what I can build for you." />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Built-in Tools */}
          <div className="mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
              <span className="inline-block rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 ring-1 ring-emerald-500/20">
                🛠️ Free Online Tools
              </span>
              <p className="mt-3 text-sm text-muted-foreground">Use these tools directly in your browser — no installation needed</p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {TOOL_SERVICES.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-emerald-500/40 md:p-8">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
                    <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-emerald-500/10 text-emerald-600 ring-emerald-500/20">
                      {tool.badge}
                    </div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{tool.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                    <ul className="mt-auto space-y-2.5">
                      {tool.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                            <Check className="h-2.5 w-2.5 text-emerald-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-border">
                      <Link href={tool.href}>
                        <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                          Try Now <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {displayServices.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Services coming soon</p>
              <p className="text-sm text-muted-foreground">Check back later or get in touch directly.</p>
              <Link href="/contact"><Button variant="outline">Contact Me</Button></Link>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {/* Featured services */}
              {featured.length > 0 && (
                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center">
                    <span className="mb-3 inline-block rounded-full bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-600 ring-1 ring-yellow-500/20">
                      ⭐ Featured Services
                    </span>
                  </motion.div>
                  <div className={`grid gap-8 ${featured.length === 1 ? "max-w-lg mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                    {featured.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* Standard services */}
              {standard.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="mb-8 text-center">
                      <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20">
                        All Services
                      </span>
                    </motion.div>
                  )}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {standard.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mt-20 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8 text-center shadow-lg shadow-primary/5 md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Have a project in mind?</h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Let&apos;s discuss your requirements and build something great together. I&apos;m always open to new opportunities.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:opacity-90">
                Get In Touch <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service, index, featured = false }: { service: Service; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl md:p-8 ${
        featured
          ? "border-primary/30 shadow-primary/5 hover:border-primary/50 hover:shadow-primary/10"
          : "border-border hover:border-primary/20"
      }`}
    >
      {/* Gradient top line */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity ${
        featured ? "via-primary opacity-100" : "via-primary/60 opacity-0 group-hover:opacity-100"
      }`} />

      {featured && (
        <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600 ring-1 ring-yellow-500/20">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> Featured
        </div>
      )}

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Briefcase className="h-6 w-6 text-primary" />
      </div>

      <h3 className="mb-2 text-xl font-bold">{service.title}</h3>

      {service.price && (
        <p className="mb-3 text-lg font-semibold text-primary">{service.price}</p>
      )}

      {service.description && (
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      )}

      {service.features && service.features.length > 0 && (
        <ul className="mt-auto space-y-2.5">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-2.5 w-2.5 text-green-600" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <Link href="/contact">
          <Button className={`w-full gap-2 ${featured ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90" : ""}`}
            variant={featured ? "default" : "outline"}>
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
