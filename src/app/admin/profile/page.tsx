"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, User, Link as LinkIcon, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  resume_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").single();
    if (data) {
      setProfile(data);
      reset({
        name: data.name || "",
        title: data.title || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        resume_url: data.resume_url || "",
      });
    }
    setLoading(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    const updateData = {
      name: data.name,
      title: data.title,
      bio: data.bio,
      avatar_url: data.avatar_url || null,
      resume_url: data.resume_url || null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (profile) {
      ({ error } = await supabase.from("profiles").update(updateData).eq("id", profile.id));
    } else {
      ({ error } = await supabase.from("profiles").insert(updateData));
    }

    if (error) {
      toast.error("Failed to save profile", { description: error.message });
    } else {
      toast.success("Profile saved successfully!");
      fetchProfile();
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Name + Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Full Name *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Title *</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Full Stack Developer" {...register("title")} />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2: Bio (full width) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bio *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Tell visitors about yourself..." rows={6} {...register("bio")} />
              {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 3: URLs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LinkIcon className="h-4 w-4" /> Avatar URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="url" placeholder="https://example.com/avatar.jpg" {...register("avatar_url")} />
              {errors.avatar_url && <p className="mt-1 text-sm text-red-500">{errors.avatar_url.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Resume URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="url" placeholder="https://example.com/resume.pdf" {...register("resume_url")} />
              {errors.resume_url && <p className="mt-1 text-sm text-red-500">{errors.resume_url.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Avatar Preview */}
        {profile?.avatar_url && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Avatar Preview</CardTitle></CardHeader>
              <CardContent>
                <img src={profile.avatar_url} alt="Avatar" className="h-24 w-24 rounded-full object-cover ring-2 ring-border" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex justify-end pb-6">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Profile
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
