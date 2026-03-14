"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, Briefcase, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/types/database";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function AdminExperiencePage() {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<ExperienceFormData>({ resolver: zodResolver(experienceSchema), defaultValues: { is_current: false } });

  const isCurrent = watch("is_current");

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
    setExperiences(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    const expData = {
      company: data.company, position: data.position,
      description: data.description || null,
      start_date: data.start_date,
      end_date: data.is_current ? null : data.end_date || null,
      is_current: data.is_current,
    };

    let error;
    if (editingExp) {
      ({ error } = await supabase.from("experiences").update(expData).eq("id", editingExp.id));
    } else {
      ({ error } = await supabase.from("experiences").insert({ ...expData, order_index: experiences.length }));
    }

    if (error) {
      toast.error(`Failed to ${editingExp ? "update" : "create"} experience`, { description: error.message });
    } else {
      toast.success(`Experience ${editingExp ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchExperiences();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setValue("company", exp.company);
    setValue("position", exp.position);
    setValue("description", exp.description || "");
    setValue("start_date", exp.start_date);
    setValue("end_date", exp.end_date || "");
    setValue("is_current", exp.is_current);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete experience", { description: error.message });
    } else {
      toast.success("Experience deleted");
      fetchExperiences();
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingExp(null); reset(); };

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
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">Manage your work history</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Experience
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: experiences.length, color: "text-foreground" },
          { label: "Current", value: experiences.filter((e) => e.is_current).length, color: "text-green-500" },
          { label: "Previous", value: experiences.filter((e) => !e.is_current).length, color: "text-muted-foreground" },
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
                  {editingExp ? "Edit Experience" : "Add New Experience"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Company *</Label>
                      <Input className="mt-1" placeholder="Company Name" {...register("company")} />
                      {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input className="mt-1" placeholder="Job Title" {...register("position")} />
                      {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position.message}</p>}
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input className="mt-1" type="date" {...register("start_date")} />
                      {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date.message}</p>}
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input className="mt-1" type="date" disabled={isCurrent} {...register("end_date")} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" {...register("is_current")} className="h-4 w-4 rounded border-border accent-primary" />
                        <span className="text-sm font-medium">I currently work here</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea className="mt-1" placeholder="Describe your responsibilities and achievements..." rows={4} {...register("description")} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingExp ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Grid */}
      {experiences.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No work experience added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Experience" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight">{exp.position}</h3>
                    <p className="text-sm text-primary">{exp.company}</p>
                  </div>
                  {exp.is_current && <Badge variant="secondary" className="shrink-0">Current</Badge>}
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  {formatDateRange(exp.start_date, exp.is_current ? null : exp.end_date)}
                </div>

                {exp.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{exp.description}</p>
                )}
              </div>

              <div className="flex justify-end gap-1 border-t border-border px-4 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(exp)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(exp.id)}>
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
