"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types/database";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  icon: z.string().optional(),
  proficiency: z.number().min(0).max(100),
});

type SkillFormData = z.infer<typeof skillSchema>;

const categories = ["frontend", "backend", "tools", "mobile", "other"];

const categoryColors: Record<string, string> = {
  frontend: "text-blue-500",
  backend: "text-green-500",
  tools: "text-yellow-500",
  mobile: "text-purple-500",
  other: "text-muted-foreground",
};

export default function AdminSkillsPage() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { proficiency: 80 },
  });

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
    setSkills(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    let error;
    if (editingSkill) {
      ({ error } = await supabase.from("skills").update({
        name: data.name, category: data.category, icon: data.icon || null, proficiency: data.proficiency,
      }).eq("id", editingSkill.id));
    } else {
      ({ error } = await supabase.from("skills").insert({
        name: data.name, category: data.category, icon: data.icon || null,
        proficiency: data.proficiency, order_index: skills.length,
      }));
    }

    if (error) {
      toast.error(`Failed to ${editingSkill ? "update" : "create"} skill`, { description: error.message });
    } else {
      toast.success(`Skill ${editingSkill ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchSkills();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setValue("name", skill.name);
    setValue("category", skill.category);
    setValue("icon", skill.icon || "");
    setValue("proficiency", skill.proficiency);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete skill", { description: error.message });
    } else {
      toast.success("Skill deleted");
      fetchSkills();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
    reset();
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Skill
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-card p-4 text-center sm:col-span-3 lg:col-span-1">
          <p className="text-2xl font-bold">{skills.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        {categories.map((cat) => (
          <div key={cat} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${categoryColors[cat]}`}>
              {groupedSkills[cat]?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground capitalize">{cat}</p>
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
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Label>Name *</Label>
                      <Input className="mt-1" placeholder="React" {...register("name")} />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <select {...register("category")}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                    </div>
                    <div>
                      <Label>Icon (optional)</Label>
                      <Input className="mt-1" placeholder="code, database…" {...register("icon")} />
                    </div>
                    <div>
                      <Label>Proficiency (0–100)</Label>
                      <Input className="mt-1" type="number" min={0} max={100}
                        {...register("proficiency", { valueAsNumber: true })} />
                      {errors.proficiency && <p className="mt-1 text-sm text-red-500">{errors.proficiency.message}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingSkill ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills grouped by category */}
      {Object.keys(groupedSkills).length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Wrench className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No skills added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Skill" to get started</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills], groupIdx) => (
            <motion.div key={category}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.05 }}>
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-lg ${categoryColors[category]}`}>
                    <Wrench className="h-5 w-5" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Badge variant="secondary" className="ml-auto">{categorySkills.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categorySkills.map((skill, i) => (
                      <motion.div key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="group relative rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md">
                        <div className="mb-3 flex items-start justify-between">
                          <p className="font-semibold">{skill.name}</p>
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(skill)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"
                              onClick={() => handleDelete(skill.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }} animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }} />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">{skill.proficiency}%</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
