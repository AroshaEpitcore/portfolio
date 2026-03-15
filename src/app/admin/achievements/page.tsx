"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus, Edit, Trash2, Save, Loader2, X, Award, CalendarDays,
  ExternalLink, Upload, ImageIcon, Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Achievement } from "@/types/database";

const CATEGORIES = ["certification", "award", "achievement"] as const;

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().optional(),
  description: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
});

type FormData = z.infer<typeof schema>;

const categoryColors: Record<string, string> = {
  certification: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  award: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  achievement: "bg-green-500/10 text-green-500 border-green-500/20",
};

export default function AdminAchievementsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { category: "certification" } });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("order_index", { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); continue; }
      if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }
      const ext = file.name.split(".").pop();
      const fileName = `achievements/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("portfolio").upload(fileName, file, { upsert: true });
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      uploaded.push(data.publicUrl);
    }
    setImages((prev) => [...prev, ...uploaded]);
    if (uploaded.length) toast.success(`${uploaded.length} image(s) uploaded`);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url));

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const payload = {
      title: data.title,
      issuer: data.issuer || null,
      description: data.description || null,
      issue_date: data.issue_date || null,
      expiry_date: data.expiry_date || null,
      credential_url: data.credential_url || null,
      category: data.category,
      images,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("achievements").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("achievements").insert({ ...payload, order_index: items.length }));
    }

    if (error) {
      toast.error(`Failed to ${editing ? "update" : "create"} achievement`, { description: error.message });
    } else {
      toast.success(`Achievement ${editing ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchItems();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (item: Achievement) => {
    setEditing(item);
    setValue("title", item.title);
    setValue("issuer", item.issuer || "");
    setValue("description", item.description || "");
    setValue("issue_date", item.issue_date || "");
    setValue("expiry_date", item.expiry_date || "");
    setValue("credential_url", item.credential_url || "");
    setValue("category", item.category as typeof CATEGORIES[number]);
    setImages(item.images || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) toast.error("Failed to delete", { description: error.message });
    else { toast.success("Deleted"); fetchItems(); }
  };

  const handleCancel = () => { setShowForm(false); setEditing(null); setImages([]); reset(); };

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
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Manage your certifications, awards & achievements</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Achievement
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: items.length, color: "text-foreground" },
          { label: "Certifications", value: items.filter((i) => i.category === "certification").length, color: "text-blue-500" },
          { label: "Awards", value: items.filter((i) => i.category === "award").length, color: "text-yellow-500" },
          { label: "Achievements", value: items.filter((i) => i.category === "achievement").length, color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editing ? "Edit Achievement" : "Add New Achievement"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label>Title *</Label>
                      <Input className="mt-1" placeholder="AWS Certified Developer" {...register("title")} />
                      {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>
                    <div>
                      <Label>Issuer / Organization</Label>
                      <Input className="mt-1" placeholder="Amazon Web Services" {...register("issuer")} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        {...register("category")}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="capitalize">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Issue Date</Label>
                      <Input className="mt-1" type="date" {...register("issue_date")} />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input className="mt-1" type="date" {...register("expiry_date")} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Credential URL</Label>
                      <Input className="mt-1" type="url" placeholder="https://credentials.example.com/verify/..." {...register("credential_url")} />
                      {errors.credential_url && <p className="mt-1 text-sm text-red-500">{errors.credential_url.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea className="mt-1" rows={3} placeholder="Brief description of this achievement..." {...register("description")} />
                    </div>

                    {/* Multi-image upload */}
                    <div className="sm:col-span-2 space-y-3">
                      <Label>Certificate / Achievement Images</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                              <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">Click to upload images</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">Select multiple — PNG, JPG, WebP up to 5MB each</p>
                            </div>
                          </>
                        )}
                      </button>

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {images.map((url, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-xl border border-border">
                              <img src={url} alt={`Image ${idx + 1}`} className="aspect-video w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editing ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {items.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No achievements yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Achievement" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md">

              {/* Image preview strip */}
              {item.images && item.images.length > 0 && (
                <div className="relative overflow-hidden rounded-t-xl">
                  <img src={item.images[0]} alt={item.title} className="h-40 w-full object-cover" />
                  {item.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      +{item.images.length - 1} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight">{item.title}</h3>
                      {item.issuer && <p className="text-sm text-primary">{item.issuer}</p>}
                    </div>
                  </div>
                  <Badge variant="outline" className={`shrink-0 capitalize text-xs ${categoryColors[item.category]}`}>
                    {item.category}
                  </Badge>
                </div>

                {item.issue_date && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    {new Date(item.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    {item.expiry_date && (
                      <span> — {new Date(item.expiry_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    )}
                  </div>
                )}

                {item.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                )}

                {item.images && item.images.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {item.images.length} image{item.images.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-2">
                {item.credential_url ? (
                  <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> Verify
                  </a>
                ) : <span />}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
