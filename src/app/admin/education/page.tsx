"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, GraduationCap, CalendarDays, Award } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDateRange } from "@/lib/utils";
import type { Education } from "@/types/database";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean(),
  grade: z.string().optional(),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type EducationFormData = z.infer<typeof educationSchema>;

export default function AdminEducationPage() {
  const supabase = createClient();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<EducationFormData>({ resolver: zodResolver(educationSchema), defaultValues: { is_current: false } });

  const isCurrent = watch("is_current");

  useEffect(() => { fetchEducations(); }, []);

  const fetchEducations = async () => {
    const { data } = await supabase.from("education").select("*").order("order_index", { ascending: true });
    setEducations(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    const payload = {
      institution: data.institution,
      degree: data.degree,
      field_of_study: data.field_of_study || null,
      description: data.description || null,
      start_date: data.start_date,
      end_date: data.is_current ? null : data.end_date || null,
      is_current: data.is_current,
      grade: data.grade || null,
      logo_url: data.logo_url || null,
    };

    let error;
    if (editingEdu) {
      ({ error } = await supabase.from("education").update(payload).eq("id", editingEdu.id));
    } else {
      ({ error } = await supabase.from("education").insert({ ...payload, order_index: educations.length }));
    }

    if (error) {
      toast.error(`Failed to ${editingEdu ? "update" : "create"} education`, { description: error.message });
    } else {
      toast.success(`Education ${editingEdu ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchEducations();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (edu: Education) => {
    setEditingEdu(edu);
    setValue("institution", edu.institution);
    setValue("degree", edu.degree);
    setValue("field_of_study", edu.field_of_study || "");
    setValue("description", edu.description || "");
    setValue("start_date", edu.start_date);
    setValue("end_date", edu.end_date || "");
    setValue("is_current", edu.is_current);
    setValue("grade", edu.grade || "");
    setValue("logo_url", edu.logo_url || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete education", { description: error.message });
    } else {
      toast.success("Education entry deleted");
      fetchEducations();
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingEdu(null); reset(); };

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
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">Manage your academic qualifications</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: educations.length, color: "text-foreground" },
          { label: "Studying", value: educations.filter((e) => e.is_current).length, color: "text-green-500" },
          { label: "Completed", value: educations.filter((e) => !e.is_current).length, color: "text-primary" },
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
                  {editingEdu ? "Edit Education" : "Add New Education"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Institution *</Label>
                      <Input className="mt-1" placeholder="University of Oxford" {...register("institution")} />
                      {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution.message}</p>}
                    </div>
                    <div>
                      <Label>Degree *</Label>
                      <Input className="mt-1" placeholder="Bachelor of Science" {...register("degree")} />
                      {errors.degree && <p className="mt-1 text-sm text-red-500">{errors.degree.message}</p>}
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input className="mt-1" placeholder="Computer Science" {...register("field_of_study")} />
                    </div>
                    <div>
                      <Label>Grade / GPA</Label>
                      <Input className="mt-1" placeholder="First Class / 3.9 GPA" {...register("grade")} />
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
                        <span className="text-sm font-medium">I am currently studying here</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Institution Logo URL (optional)</Label>
                      <Input className="mt-1" type="url" placeholder="https://example.com/logo.png" {...register("logo_url")} />
                      {errors.logo_url && <p className="mt-1 text-sm text-red-500">{errors.logo_url.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea className="mt-1" placeholder="Relevant coursework, achievements, activities..." rows={3} {...register("description")} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingEdu ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Grid */}
      {educations.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <GraduationCap className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No education entries yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Education" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {educations.map((edu, i) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start gap-3">
                  {edu.logo_url ? (
                    <img src={edu.logo_url} alt={edu.institution}
                      className="h-11 w-11 flex-shrink-0 rounded-xl object-contain ring-1 ring-border" />
                  ) : (
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight">{edu.degree}</h3>
                    <p className="text-sm text-primary">{edu.institution}</p>
                  </div>
                  {edu.is_current && <Badge variant="secondary" className="shrink-0">Studying</Badge>}
                </div>

                {edu.field_of_study && (
                  <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                )}

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  {formatDateRange(edu.start_date, edu.is_current ? null : edu.end_date)}
                </div>

                {edu.grade && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Award className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                    <span className="font-medium">{edu.grade}</span>
                  </div>
                )}

                {edu.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{edu.description}</p>
                )}
              </div>

              <div className="flex justify-end gap-1 border-t border-border px-4 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(edu)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(edu.id)}>
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
