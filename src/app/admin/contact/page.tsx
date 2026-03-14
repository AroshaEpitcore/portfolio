"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, Mail, Phone, MapPin, CheckCircle, Trash2, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { ContactInfo, ContactSubmission } from "@/types/database";

const contactInfoSchema = z.object({
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
});

type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

export default function AdminContactPage() {
  const supabase = createClient();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [infoResult, submissionsResult] = await Promise.all([
      supabase.from("contact_info").select("*").single(),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    if (infoResult.data) {
      setContactInfo(infoResult.data);
      reset({
        email: infoResult.data.email || "",
        phone: infoResult.data.phone || "",
        location: infoResult.data.location || "",
        availability: infoResult.data.availability || "",
      });
    }
    setSubmissions(submissionsResult.data || []);
    setLoading(false);
  };

  const onSubmit = async (data: ContactInfoFormData) => {
    setIsSubmitting(true);
    const updateData = {
      email: data.email || null, phone: data.phone || null,
      location: data.location || null, availability: data.availability || null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (contactInfo) {
      ({ error } = await supabase.from("contact_info").update(updateData).eq("id", contactInfo.id));
    } else {
      ({ error } = await supabase.from("contact_info").insert(updateData));
    }

    if (error) {
      toast.error("Failed to save contact info", { description: error.message });
    } else {
      toast.success("Contact info saved successfully!");
      fetchData();
    }
    setIsSubmitting(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    fetchData();
    toast.success("Marked as read");
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete message", { description: error.message });
    } else {
      toast.success("Message deleted");
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground">Manage contact info and view submissions</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Messages", value: submissions.length, color: "text-foreground" },
          { label: "Unread", value: unreadCount, color: "text-primary" },
          { label: "Read", value: submissions.length - unreadCount, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Contact Info Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                  <Input className="mt-1" type="email" placeholder="hello@example.com" {...register("email")} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
                  <Input className="mt-1" placeholder="+1 (555) 123-4567" {...register("phone")} />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</Label>
                  <Input className="mt-1" placeholder="San Francisco, CA" {...register("location")} />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Availability</Label>
                  <Input className="mt-1" placeholder="Available for freelance projects" {...register("availability")} />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Contact Info
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submissions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-xl font-semibold">Submissions</h2>
          {unreadCount > 0 && <Badge>{unreadCount} new</Badge>}
        </div>

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No submissions yet</p>
              <p className="text-sm text-muted-foreground">Contact form submissions will appear here</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {submissions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-md ${
                  s.is_read ? "border-border bg-card" : "border-primary/40 bg-primary/5"
                }`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{s.name}</p>
                      {!s.is_read && <Badge className="shrink-0 text-xs">New</Badge>}
                    </div>
                    <a href={`mailto:${s.email}`} className="text-sm text-muted-foreground hover:text-primary">
                      {s.email}
                    </a>
                  </div>
                </div>

                {s.subject && <p className="mb-2 text-sm font-medium">{s.subject}</p>}
                <p className="flex-1 text-sm text-muted-foreground line-clamp-4">{s.message}</p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">{formatDate(s.created_at)}</span>
                  <div className="flex gap-1">
                    {!s.is_read && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Mark as read"
                        onClick={() => markAsRead(s.id)}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => deleteSubmission(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
