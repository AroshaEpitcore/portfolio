"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  RotateCcw,
  Trash2,
  Eye,
  X,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { FREE_GENERATIONS } from "@/lib/payment-config";
import type { CVUser, CVGeneration, CVFormData } from "@/types/database";
import { UserCVDocument } from "@/lib/cv-user-pdf";
import { toast } from "sonner";

// PDFViewer is browser-only
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Rendering PDF…
      </div>
    ),
  }
);

// ── CV Preview Drawer (slides from right) ─────────────────────────────────────

function CVPreviewDrawer({
  data,
  label,
  onClose,
}: {
  data: CVFormData;
  label: string;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-border bg-card shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{label}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
            <UserCVDocument data={data} />
          </PDFViewer>
        </div>
      </motion.div>
    </>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <p className="mb-5 text-sm text-foreground">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<CVUser | null>(null);
  const [generations, setGenerations] = useState<CVGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [previewData, setPreviewData] = useState<{ data: CVFormData; label: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: userData, error: userErr }, { data: genData }] = await Promise.all([
      supabase.from("cv_users").select("*").eq("id", id).single(),
      supabase.from("cv_generations").select("*").eq("user_id", id).order("generated_at", { ascending: false }),
    ]);
    if (userErr) {
      toast.error("User not found");
      router.push("/admin/users");
      return;
    }
    setUser(userData as unknown as CVUser);
    setGenerations((genData ?? []) as unknown as CVGeneration[]);
    setLoading(false);
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Actions ──────────────────────────────────────────────────────────────

  async function togglePaid(paid: boolean) {
    if (!user) return;
    setUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("cv_users")
      .update({ is_paid: paid, paid_at: paid ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Update failed: " + error.message);
    } else {
      toast.success(paid ? "Marked as paid" : "Payment revoked");
      setUser((u) => u ? { ...u, is_paid: paid, paid_at: paid ? new Date().toISOString() : null } : u);
    }
    setUpdating(false);
  }

  async function resetGenerations() {
    if (!user) return;
    setUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("cv_users")
      .update({ generations_used: 0, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Reset failed: " + error.message);
    } else {
      toast.success("Generations reset to 0");
      setUser((u) => u ? { ...u, generations_used: 0 } : u);
    }
    setUpdating(false);
    setConfirmAction(null);
  }

  async function deleteUser() {
    if (!user) return;
    setUpdating(true);
    const supabase = createClient();
    await supabase.from("cv_generations").delete().eq("user_id", user.id);
    const { error } = await supabase.from("cv_users").delete().eq("id", user.id);
    if (error) {
      toast.error("Delete failed: " + error.message);
      setUpdating(false);
    } else {
      toast.success(`${user.email} deleted`);
      router.push("/admin/users");
    }
    setConfirmAction(null);
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const isLimited = user.generations_used >= FREE_GENERATIONS && !user.is_paid;
  const remaining = Math.max(0, FREE_GENERATIONS - user.generations_used);

  return (
    <div className="space-y-6">
      {/* Confirm dialog */}
      <AnimatePresence>
        {confirmAction && (
          <ConfirmDialog
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>

      {/* Preview drawer */}
      <AnimatePresence>
        {previewData && (
          <CVPreviewDrawer
            data={previewData.data}
            label={previewData.label}
            onClose={() => setPreviewData(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/users")}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Users
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{user.full_name ?? user.email}</span>
        </div>
        <div className="flex gap-2">
          {user.saved_cv_data && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPreviewData({
                  data: user.saved_cv_data as CVFormData,
                  label: "Latest Draft",
                })
              }
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Draft
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* User info card */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {(user.full_name ?? user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">{user.full_name ?? "No name"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                {user.is_paid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" /> Paid — Unlimited access
                  </span>
                ) : isLimited ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-500/20 dark:text-red-400">
                    <Clock className="h-3 w-3" /> Awaiting Payment
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400">
                    Free — {remaining} generation{remaining !== 1 ? "s" : ""} left
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "CVs Generated", value: user.generations_used },
              { label: "Free Limit", value: FREE_GENERATIONS },
              { label: "Joined", value: new Date(user.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Last Updated", value: new Date(user.updated_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          {user.paid_at && (
            <p className="mt-3 text-xs text-muted-foreground">
              Paid on {new Date(user.paid_at).toLocaleString()}
              {user.payment_reference ? ` · Ref: ${user.payment_reference}` : ""}
            </p>
          )}
        </div>

        {/* Actions card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold mb-4">Actions</h2>

          {user.is_paid ? (
            <Button
              variant="outline"
              className="w-full gap-2 justify-start"
              disabled={updating}
              onClick={() => togglePaid(false)}
            >
              <XCircle className="h-4 w-4" /> Revoke Payment
            </Button>
          ) : (
            <Button
              className="w-full gap-2 justify-start bg-green-600 text-white hover:bg-green-700"
              disabled={updating}
              onClick={() => togglePaid(true)}
            >
              <CheckCircle className="h-4 w-4" /> Mark as Paid
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2 justify-start"
            disabled={updating || user.generations_used === 0}
            onClick={() =>
              setConfirmAction({
                message: `Reset generations for ${user.email}? They will get ${FREE_GENERATIONS} free generations again.`,
                onConfirm: resetGenerations,
              })
            }
          >
            <RotateCcw className="h-4 w-4" /> Reset Generations
          </Button>

          <Button
            variant="outline"
            className="w-full gap-2 justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
            disabled={updating}
            onClick={() =>
              setConfirmAction({
                message: `Permanently delete ${user.email}? This removes all their CV data and cannot be undone.`,
                onConfirm: deleteUser,
              })
            }
          >
            <Trash2 className="h-4 w-4" /> Delete User
          </Button>
        </div>
      </div>

      {/* Generation history */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">CV Generation History</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {generations.length} CV{generations.length !== 1 ? "s" : ""} generated
          </p>
        </div>

        {generations.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No CVs generated yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {generations.map((gen, i) => {
              const cvData = gen.cv_data as CVFormData;
              const name = cvData?.personal?.fullName || user.full_name || user.email;
              const jobTitle = cvData?.personal?.jobTitle || "—";
              return (
                <div
                  key={gen.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      #{generations.length - i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(gen.generated_at).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() =>
                        setPreviewData({
                          data: cvData,
                          label: `CV #${generations.length - i} — ${new Date(gen.generated_at).toLocaleDateString()}`,
                        })
                      }
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
