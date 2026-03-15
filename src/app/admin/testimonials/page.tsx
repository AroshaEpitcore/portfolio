"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  company: z.string().optional(),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  content: z.string().min(10, "Testimonial must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5),
  is_featured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { rating: 5, is_featured: false } });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("order_index", { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const payload = {
      name: data.name,
      role: data.role || null,
      company: data.company || null,
      avatar_url: data.avatar_url || null,
      content: data.content,
      rating: data.rating,
      is_featured: data.is_featured,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("testimonials").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("testimonials").insert({ ...payload, order_index: items.length }));
    }

    if (error) {
      toast.error(`Failed to ${editing ? "update" : "create"} testimonial`, { description: error.message });
    } else {
      toast.success(`Testimonial ${editing ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchItems();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditing(item);
    setValue("name", item.name);
    setValue("role", item.role || "");
    setValue("company", item.company || "");
    setValue("avatar_url", item.avatar_url || "");
    setValue("content", item.content);
    setValue("rating", item.rating);
    setValue("is_featured", item.is_featured);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error("Failed to delete", { description: error.message });
    else { toast.success("Testimonial deleted"); fetchItems(); }
  };

  const handleCancel = () => { setShowForm(false); setEditing(null); reset(); };

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
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage client reviews and feedback</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Testimonial
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: items.length, color: "text-foreground" },
          { label: "Featured", value: items.filter((i) => i.is_featured).length, color: "text-yellow-500" },
          { label: "Standard", value: items.filter((i) => !i.is_featured).length, color: "text-primary" },
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
                  {editing ? "Edit Testimonial" : "Add New Testimonial"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name *</Label>
                      <Input className="mt-1" placeholder="John Smith" {...register("name")} />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label>Role / Position</Label>
                      <Input className="mt-1" placeholder="CEO" {...register("role")} />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input className="mt-1" placeholder="Acme Inc." {...register("company")} />
                    </div>
                    <div>
                      <Label>Rating (1–5)</Label>
                      <Input className="mt-1" type="number" min={1} max={5} {...register("rating")} />
                      {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Avatar URL (optional)</Label>
                      <Input className="mt-1" type="url" placeholder="https://example.com/avatar.jpg" {...register("avatar_url")} />
                      {errors.avatar_url && <p className="mt-1 text-sm text-red-500">{errors.avatar_url.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Testimonial *</Label>
                      <Textarea className="mt-1" placeholder="What the client said..." rows={4} {...register("content")} />
                      {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded border-border accent-primary" />
                        <span className="text-sm font-medium">Featured — show prominently on homepage</span>
                      </label>
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
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No testimonials yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Testimonial" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>

                <p className="line-clamp-3 text-sm text-muted-foreground">&ldquo;{item.content}&rdquo;</p>

                <div className="mt-auto flex items-center gap-3">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    {(item.role || item.company) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.role, item.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  {item.is_featured && <Badge variant="secondary" className="shrink-0 text-yellow-600">Featured</Badge>}
                </div>
              </div>

              <div className="flex justify-end gap-1 border-t border-border px-4 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
