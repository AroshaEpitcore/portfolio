"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, Github, Linkedin, Twitter, Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { SocialLink } from "@/types/database";

const socialSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
});

type SocialFormData = z.infer<typeof socialSchema>;

const platformIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  default: Globe,
};

const platformColors: Record<string, string> = {
  github: "bg-zinc-800 text-white",
  linkedin: "bg-blue-600 text-white",
  twitter: "bg-sky-500 text-white",
  default: "bg-primary/10 text-primary",
};

export default function AdminSocialPage() {
  const supabase = createClient();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
  });

  useEffect(() => { fetchSocialLinks(); }, []);

  const fetchSocialLinks = async () => {
    const { data } = await supabase.from("social_links").select("*").order("order_index", { ascending: true });
    setSocialLinks(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: SocialFormData) => {
    setIsSubmitting(true);
    const payload = { platform: data.platform, url: data.url, icon: data.icon || data.platform.toLowerCase() };

    let error;
    if (editingLink) {
      ({ error } = await supabase.from("social_links").update(payload).eq("id", editingLink.id));
    } else {
      ({ error } = await supabase.from("social_links").insert({ ...payload, order_index: socialLinks.length }));
    }

    if (error) {
      toast.error(`Failed to ${editingLink ? "update" : "create"} social link`, { description: error.message });
    } else {
      toast.success(`Social link ${editingLink ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchSocialLinks();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setValue("platform", link.platform);
    setValue("url", link.url);
    setValue("icon", link.icon || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete social link", { description: error.message });
    } else {
      toast.success("Social link deleted");
      fetchSocialLinks();
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingLink(null); reset(); };

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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Links</h1>
          <p className="text-muted-foreground">Manage your social media profiles</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Link
          </Button>
        )}
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingLink ? "Edit Social Link" : "Add New Social Link"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Platform *</Label>
                      <Input className="mt-1" placeholder="GitHub, LinkedIn, Twitter…" {...register("platform")} />
                      {errors.platform && <p className="mt-1 text-sm text-red-500">{errors.platform.message}</p>}
                    </div>
                    <div>
                      <Label>URL *</Label>
                      <Input className="mt-1" type="url" placeholder="https://github.com/username" {...register("url")} />
                      {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
                    </div>
                    <div>
                      <Label>Icon (optional)</Label>
                      <Input className="mt-1" placeholder="github, linkedin, twitter…" {...register("icon")} />
                      <p className="mt-1 text-xs text-muted-foreground">Leave empty to auto-detect</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingLink ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links Grid */}
      {socialLinks.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Globe className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No social links added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Link" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {socialLinks.map((link, i) => {
            const iconKey = link.icon?.toLowerCase() || "";
            const Icon = platformIcons[iconKey] || platformIcons.default;
            const colorClass = platformColors[iconKey] || platformColors.default;
            return (
              <motion.div key={link.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{link.platform}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary">
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>
                <div className="flex justify-end gap-1 border-t border-border pt-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(link)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(link.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
