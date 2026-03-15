"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, Users, Github, Linkedin, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_active: z.boolean(),
  order_index: z.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

export default function AdminTeamPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, order_index: 0 },
  });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("team_members").select("*").order("order_index", { ascending: true });
    setMembers(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const payload = {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      avatar_url: avatarUrl || null,
      linkedin_url: data.linkedin_url || null,
      github_url: data.github_url || null,
      is_active: data.is_active,
      order_index: data.order_index,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("team_members").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("team_members").insert({ ...payload, order_index: members.length }));
    }

    if (error) {
      toast.error(`Failed to ${editing ? "update" : "create"} member`, { description: error.message });
    } else {
      toast.success(`Team member ${editing ? "updated" : "added"}!`);
      handleCancel();
      fetchMembers();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setValue("name", member.name);
    setValue("role", member.role);
    setValue("bio", member.bio || "");
    setAvatarUrl(member.avatar_url || null);
    setValue("linkedin_url", member.linkedin_url || "");
    setValue("github_url", member.github_url || "");
    setValue("is_active", member.is_active);
    setValue("order_index", member.order_index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete", { description: error.message });
    } else {
      toast.success("Team member removed");
      fetchMembers();
    }
  };

  const handleCancel = () => { setShowForm(false); setEditing(null); setAvatarUrl(null); reset({ is_active: true, order_index: 0 }); };

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
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage your team on the site</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Member
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
                  {editing ? "Edit Team Member" : "Add Team Member"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name *</Label>
                      <Input className="mt-1" placeholder="John Doe" {...register("name")} />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label>Role *</Label>
                      <Input className="mt-1" placeholder="Frontend Developer" {...register("role")} />
                      {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
                    </div>
                  </div>

                  <div>
                    <Label>Bio</Label>
                    <Textarea className="mt-1" rows={3} placeholder="Short bio about this team member..." {...register("bio")} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Avatar</Label>
                      <div className="mt-1">
                        <ImageUpload
                          value={avatarUrl}
                          onChange={setAvatarUrl}
                          folder="team"
                          label="Avatar"
                          aspectRatio="square"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>LinkedIn URL</Label>
                      <Input className="mt-1" placeholder="https://linkedin.com/in/..." {...register("linkedin_url")} />
                      {errors.linkedin_url && <p className="mt-1 text-sm text-red-500">{errors.linkedin_url.message}</p>}
                    </div>
                    <div>
                      <Label>GitHub URL</Label>
                      <Input className="mt-1" placeholder="https://github.com/..." {...register("github_url")} />
                      {errors.github_url && <p className="mt-1 text-sm text-red-500">{errors.github_url.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Order Index</Label>
                      <Input className="mt-1" type="number" min={0} {...register("order_index", { valueAsNumber: true })} />
                    </div>
                    <div className="flex items-end gap-3 pb-0.5">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 rounded" {...register("is_active")} />
                        <span className="text-sm font-medium">Active (visible on site)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editing ? "Update" : "Add Member"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members Grid */}
      {members.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Users className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Member" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">

              <div className="flex items-start gap-4">
                {/* Avatar */}
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name}
                    className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary ring-2 ring-border">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold leading-tight">{member.name}</p>
                    {!member.is_active && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Hidden</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-primary">{member.role}</p>
                  {member.bio && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{member.bio}</p>}
                </div>
              </div>

              {/* Social links */}
              {(member.linkedin_url || member.github_url) && (
                <div className="flex gap-2">
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-blue-500/50 hover:text-blue-500">
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground">
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <GripVertical className="h-3.5 w-3.5" /> #{member.order_index}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-1 border-t border-border pt-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(member.id)}>
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
