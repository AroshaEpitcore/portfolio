"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Save, Loader2, X, Briefcase, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/types/database";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  price: z.string().optional(),
  features: z.string().optional(),
  is_featured: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<ServiceFormData>({ resolver: zodResolver(serviceSchema), defaultValues: { is_featured: false } });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("order_index", { ascending: true });
    setServices(data || []);
    setLoading(false);
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    const featuresArray = data.features
      ? data.features.split("\n").map((f) => f.trim()).filter(Boolean)
      : null;

    const payload = {
      title: data.title,
      description: data.description || null,
      icon: data.icon || null,
      price: data.price || null,
      features: featuresArray,
      is_featured: data.is_featured,
    };

    let error;
    if (editingService) {
      ({ error } = await supabase.from("services").update(payload).eq("id", editingService.id));
    } else {
      ({ error } = await supabase.from("services").insert({ ...payload, order_index: services.length }));
    }

    if (error) {
      toast.error(`Failed to ${editingService ? "update" : "create"} service`, { description: error.message });
    } else {
      toast.success(`Service ${editingService ? "updated" : "created"} successfully!`);
      handleCancel();
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setValue("title", service.title);
    setValue("description", service.description || "");
    setValue("icon", service.icon || "");
    setValue("price", service.price || "");
    setValue("features", service.features?.join("\n") || "");
    setValue("is_featured", service.is_featured);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete service", { description: error.message });
    } else {
      toast.success("Service deleted");
      fetchServices();
    }
  };

  const handleCancel = () => { setShowForm(false); setEditingService(null); reset(); };

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
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your freelance services and offerings</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: services.length, color: "text-foreground" },
          { label: "Featured", value: services.filter((s) => s.is_featured).length, color: "text-yellow-500" },
          { label: "Standard", value: services.filter((s) => !s.is_featured).length, color: "text-muted-foreground" },
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
                  {editingService ? "Edit Service" : "Add New Service"}
                  <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Title *</Label>
                      <Input className="mt-1" placeholder="Web Development" {...register("title")} />
                      {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>
                    <div>
                      <Label>Price / Rate</Label>
                      <Input className="mt-1" placeholder="Starting from $500 / $50/hr" {...register("price")} />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input className="mt-1" placeholder="code, globe, smartphone…" {...register("icon")} />
                      <p className="mt-1 text-xs text-muted-foreground">Lucide icon name</p>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" {...register("is_featured")} className="h-4 w-4 rounded border-border accent-primary" />
                        <span className="text-sm font-medium">Mark as Featured</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea className="mt-1" placeholder="Describe what this service includes..." rows={3} {...register("description")} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Features / What&apos;s Included</Label>
                      <Textarea className="mt-1" placeholder={"Responsive design\nSEO optimized\n3 revision rounds\nSource code included"} rows={5} {...register("features")} />
                      <p className="mt-1 text-xs text-muted-foreground">One feature per line</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingService ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      {services.length === 0 && !showForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No services added yet</p>
            <p className="text-sm text-muted-foreground">Click "Add Service" to get started</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.title}</h3>
                      {service.price && (
                        <p className="text-sm font-medium text-primary">{service.price}</p>
                      )}
                    </div>
                  </div>
                  {service.is_featured && (
                    <Badge className="shrink-0 gap-1 bg-yellow-500/10 text-yellow-600 ring-1 ring-yellow-500/20">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> Featured
                    </Badge>
                  )}
                </div>

                {service.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                )}

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1">
                    {service.features.slice(0, 4).map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-xs text-muted-foreground">+{service.features.length - 4} more</li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex justify-end gap-1 border-t border-border px-4 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(service)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(service.id)}>
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
