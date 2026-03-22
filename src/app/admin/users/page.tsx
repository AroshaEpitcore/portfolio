"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { FREE_GENERATIONS } from "@/lib/payment-config";
import type { CVUser } from "@/types/database";
import { toast } from "sonner";

type SortField = "created_at" | "generations_used" | "email";
type SortDir = "asc" | "desc";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <p className="text-sm text-foreground mb-5">{message}</p>
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

// ── Detail drawer ─────────────────────────────────────────────────────────────

function UserDetail({ user, onClose }: { user: CVUser; onClose: () => void }) {
  const isLimited = user.generations_used >= FREE_GENERATIONS && !user.is_paid;
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-y-0 right-0 z-40 w-full max-w-sm border-l border-border bg-card shadow-2xl overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">User Details</h2>
        <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {(user.full_name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user.full_name ?? "No name"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Generations Used", value: user.generations_used },
            { label: "Free Limit", value: FREE_GENERATIONS },
            { label: "Status", value: user.is_paid ? "Paid" : isLimited ? "Awaiting Payment" : "Free" },
            { label: "Paid At", value: user.paid_at ? new Date(user.paid_at).toLocaleDateString() : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-sm font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Joined</span>
            <span>{new Date(user.created_at).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last updated</span>
            <span>{new Date(user.updated_at).toLocaleString()}</span>
          </div>
          {user.payment_reference && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment ref</span>
              <span className="font-medium text-primary">{user.payment_reference}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<CVUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "limited">("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<CVUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cv_users")
      .select("*")
      .order(sortField, { ascending: sortDir === "asc" });
    if (error) {
      toast.error("Failed to load users: " + error.message);
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  }, [sortField, sortDir]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Actions ────────────────────────────────────────────────────────────────

  async function togglePaid(user: CVUser, paid: boolean) {
    setUpdating(user.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("cv_users")
      .update({ is_paid: paid, paid_at: paid ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Update failed: " + error.message);
    } else {
      toast.success(paid ? `${user.email} marked as paid` : `Payment revoked for ${user.email}`);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_paid: paid, paid_at: paid ? new Date().toISOString() : null } : u));
      if (selectedUser?.id === user.id) setSelectedUser((u) => u ? { ...u, is_paid: paid } : u);
    }
    setUpdating(null);
  }

  async function resetGenerations(user: CVUser) {
    setUpdating(user.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("cv_users")
      .update({ generations_used: 0, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Reset failed: " + error.message);
    } else {
      toast.success(`Generations reset for ${user.email}`);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, generations_used: 0 } : u));
      if (selectedUser?.id === user.id) setSelectedUser((u) => u ? { ...u, generations_used: 0 } : u);
    }
    setUpdating(null);
  }

  async function deleteUser(user: CVUser) {
    setUpdating(user.id);
    const supabase = createClient();
    // Delete generations first (FK), then user record
    await supabase.from("cv_generations").delete().eq("user_id", user.id);
    const { error } = await supabase.from("cv_users").delete().eq("id", user.id);
    if (error) {
      toast.error("Delete failed: " + error.message);
    } else {
      toast.success(`${user.email} deleted`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedUser?.id === user.id) setSelectedUser(null);
    }
    setUpdating(null);
    setConfirmAction(null);
  }

  // ── Sort toggle ────────────────────────────────────────────────────────────

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortDir === "asc"
      ? <ChevronUp className="ml-1 inline h-3 w-3" />
      : <ChevronDown className="ml-1 inline h-3 w-3" />;
  }

  // ── Filter + search ────────────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "paid" ? u.is_paid :
      filter === "unpaid" ? !u.is_paid :
      u.generations_used >= FREE_GENERATIONS && !u.is_paid;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    paid: users.filter((u) => u.is_paid).length,
    limited: users.filter((u) => u.generations_used >= FREE_GENERATIONS && !u.is_paid).length,
    totalGens: users.reduce((s, u) => s + u.generations_used, 0),
  };

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

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage CV Generator accounts and access</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Paid Users", value: stats.paid, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Awaiting Payment", value: stats.limited, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "CVs Generated", value: stats.totalGens, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "paid", "unpaid", "limited"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "paid" ? "Paid" : f === "unpaid" ? "Unpaid" : "Needs Payment"}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("email")} className="flex items-center hover:text-foreground">
                    User <SortIcon field="email" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("generations_used")} className="flex items-center hover:text-foreground">
                    Generated <SortIcon field="generations_used" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <button onClick={() => toggleSort("created_at")} className="flex items-center hover:text-foreground">
                    Joined <SortIcon field="created_at" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading users…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const isLimited = user.generations_used >= FREE_GENERATIONS && !user.is_paid;
                  const busy = updating === user.id;
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20 last:border-0"
                    >
                      {/* User */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-3 text-left hover:opacity-80"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {(user.full_name ?? user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </button>
                      </td>

                      {/* Generated */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          user.generations_used >= FREE_GENERATIONS
                            ? "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400"
                            : "bg-muted text-muted-foreground ring-border"
                        }`}>
                          {user.generations_used} / {user.is_paid ? "∞" : FREE_GENERATIONS}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {user.is_paid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/20 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" /> Paid
                          </span>
                        ) : isLimited ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-500/20 dark:text-red-400">
                            <Clock className="h-3 w-3" /> Awaiting Payment
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400">
                            Free ({FREE_GENERATIONS - user.generations_used} left)
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Mark paid / Revoke */}
                          {user.is_paid ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePaid(user, false)}
                              disabled={busy}
                              className="h-7 gap-1 px-2 text-xs"
                            >
                              {busy ? <RefreshCw className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => togglePaid(user, true)}
                              disabled={busy}
                              className="h-7 gap-1 bg-green-600 px-2 text-xs text-white hover:bg-green-700"
                            >
                              {busy ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                              Mark Paid
                            </Button>
                          )}

                          {/* Reset generations */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                message: `Reset generations for ${user.email}? They will get ${FREE_GENERATIONS} free generations again.`,
                                onConfirm: () => { setConfirmAction(null); resetGenerations(user); },
                              })
                            }
                            disabled={busy || user.generations_used === 0}
                            className="h-7 gap-1 px-2 text-xs"
                            title="Reset free generations"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                message: `Permanently delete ${user.email}? This removes all their CV data and cannot be undone.`,
                                onConfirm: () => deleteUser(user),
                              })
                            }
                            disabled={busy}
                            className="h-7 gap-1 px-2 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-500"
                            title="Delete user"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}
