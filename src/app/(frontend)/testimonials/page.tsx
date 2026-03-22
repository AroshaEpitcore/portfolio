"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, Star, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/sections/page-hero";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(20, "Please write at least 20 characters"),
  rating: z.coerce.number().min(1, "Please select a rating").max(5),
});

type FormData = z.infer<typeof schema>;

export default function TestimonialsSubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Failed to submit review", { description: json.error });
        setIsSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <PageHero badge="Thank You" title="Review" titleAccent="Submitted!" description="Your feedback means the world." />
        <section className="pb-24">
          <div className="mx-auto max-w-lg px-4 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 rounded-2xl border border-green-500/30 bg-green-500/5 p-10">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Thank you for your feedback!</h2>
                <p className="text-muted-foreground">
                  Your review has been received and is pending approval. Once reviewed, it will appear on the site.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        badge="Testimonials"
        title="Leave a"
        titleAccent="Review"
        description="Worked with me? I'd love to hear your feedback. Your review helps others know what to expect."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MessageSquarePlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Share your experience</p>
                    <p className="text-xs text-muted-foreground">Reviews are approved before being published</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Star rating */}
                  <div>
                    <Label className="mb-2 block">Rating *</Label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setValue("rating", star, { shouldValidate: true })}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= (hoveredStar || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>}
                  </div>

                  {/* Name + Role row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1 block">Full Name *</Label>
                      <Input placeholder="Jane Smith" {...register("name")} />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label className="mb-1 block">Role / Position</Label>
                      <Input placeholder="Product Manager" {...register("role")} />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <Label className="mb-1 block">Company</Label>
                    <Input placeholder="Acme Corp" {...register("company")} />
                  </div>

                  {/* Review content */}
                  <div>
                    <Label className="mb-1 block">Your Review *</Label>
                    <Textarea
                      placeholder="Share your experience working with me — what did we build together, and how did it go?"
                      rows={5}
                      {...register("content")}
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
