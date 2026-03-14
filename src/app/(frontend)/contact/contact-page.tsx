"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { LampSection } from "@/components/ui/lamp";
import { SpotlightCard } from "@/components/ui/spotlight";
import type { ContactInfo, SocialLink } from "@/types/database";

interface ContactPageProps {
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const iconMap: { [key: string]: React.ElementType } = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

// Placeholder data
const placeholderContactInfo: Partial<ContactInfo> = {
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  availability: "Available for freelance projects",
};

const placeholderSocialLinks: Partial<SocialLink>[] = [
  { id: "1", platform: "GitHub", url: "#", icon: "github" },
  { id: "2", platform: "LinkedIn", url: "#", icon: "linkedin" },
  { id: "3", platform: "Twitter", url: "#", icon: "twitter" },
];

export function ContactPage({ contactInfo, socialLinks }: ContactPageProps) {
  const displayContactInfo = contactInfo || placeholderContactInfo;
  const displaySocialLinks =
    socialLinks && socialLinks.length > 0 ? socialLinks : placeholderSocialLinks;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: displayContactInfo.email,
      href: `mailto:${displayContactInfo.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: displayContactInfo.phone,
      href: `tel:${displayContactInfo.phone}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: displayContactInfo.location,
      href: null,
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero — touches navbar */}
      <LampSection
        title="Get in Touch"
        description="Have a project in mind? Let's talk about it."
        className="pt-16"
      />

      {/* Contact Section */}
      <section className="relative -mt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard className="relative h-full overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                <h2 className="mb-2 text-2xl font-bold">Contact Information</h2>
                <p className="mb-8 text-muted-foreground">
                  Feel free to reach out through any of the following channels.
                </p>

                {/* Contact Details */}
                <div className="mb-8 space-y-4">
                  {contactDetails.map(({ icon: Icon, label, value, href }) =>
                    value ? (
                      <div
                        key={label}
                        className="group flex items-center gap-4 rounded-xl border border-border/50 bg-background/40 p-4 transition-all hover:border-primary/30 hover:bg-background/60"
                      >
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/20">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="font-medium transition-colors hover:text-primary"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="font-medium">{value}</p>
                          )}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                {/* Availability */}
                {displayContactInfo.availability && (
                  <div className="mb-8">
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                      {displayContactInfo.availability}
                    </span>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Connect with me
                  </h3>
                  <div className="flex gap-3">
                    {displaySocialLinks.map((social) => {
                      const Icon = iconMap[social.icon || "mail"] || Mail;
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/60 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-md hover:shadow-primary/20"
                          aria-label={social.platform}
                        >
                          <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SpotlightCard className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

                <h2 className="mb-6 text-2xl font-bold">Send me a message</h2>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">
                      Message sent! I&apos;ll get back to you soon.
                    </span>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">
                      Failed to send. Please try again or email me directly.
                    </span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        {...register("name")}
                        className="mt-1.5 border-border/60 bg-background/60 focus:border-primary/50"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register("email")}
                        className="mt-1.5 border-border/60 bg-background/60 focus:border-primary/50"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      {...register("subject")}
                      className="mt-1.5 border-border/60 bg-background/60 focus:border-primary/50"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your project..."
                      rows={5}
                      {...register("message")}
                      className="mt-1.5 border-border/60 bg-background/60 focus:border-primary/50"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
