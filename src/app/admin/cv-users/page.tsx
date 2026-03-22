"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FREE_GENERATIONS } from "@/lib/payment-config";
import type { CVUser } from "@/types/database";
import { toast } from "sonner";

export default function CVUsersPage() {
  const [users, setUsers] = useState<CVUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "limited">(
    "all"
  );
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cv-users");
      const body = await res.json();
      if (!res.ok) {
        toast.error("Failed to load users: " + (body?.error ?? res.status));
      } else {
        setUsers(body);
      }
    } catch (err) {
      toast.error("Failed to load users: " + String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function togglePaid(user: CVUser, paid: boolean) {
    setUpdating(user.id);
    try {
      const res = await fetch("/api/admin/cv-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, is_paid: paid }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error("Update failed: " + err.error);
      } else {
        toast.success(
          paid
            ? `${user.email} marked as paid`
            : `Payment revoked for ${user.email}`
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, is_paid: paid, paid_at: paid ? new Date().toISOString() : null }
              : u
          )
        );
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "paid"
        ? u.is_paid
        : filter === "unpaid"
        ? !u.is_paid
        : filter === "limited"
        ? u.generations_used >= FREE_GENERATIONS && !u.is_paid
        : true;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    paid: users.filter((u) => u.is_paid).length,
    limited: users.filter(
      (u) => u.generations_used >= FREE_GENERATIONS && !u.is_paid
    ).length,
    totalGens: users.reduce((sum, u) => sum + u.generations_used, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CV Generator Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts and payment status
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: stats.total,
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "Paid Users",
            value: stats.paid,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "Awaiting Payment",
            value: stats.limited,
            icon: Clock,
            color: "text-amber-500",
          },
          {
            label: "CVs Generated",
            value: stats.totalGens,
            icon: XCircle,
            color: "text-purple-500",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name…"
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
              {f === "all"
                ? "All"
                : f === "paid"
                ? "Paid"
                : f === "unpaid"
                ? "Unpaid"
                : "Needs Payment"}
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
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Generated
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Loading users…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const isLimited =
                    user.generations_used >= FREE_GENERATIONS && !user.is_paid;
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {(user.full_name ?? user.email)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.full_name ?? "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                            user.generations_used >= FREE_GENERATIONS
                              ? "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400"
                              : "bg-muted text-muted-foreground ring-border"
                          }`}
                        >
                          {user.generations_used} /{" "}
                          {user.is_paid ? "∞" : FREE_GENERATIONS}
                        </span>
                      </td>
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
                            Free ({FREE_GENERATIONS - user.generations_used}{" "}
                            left)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.is_paid ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePaid(user, false)}
                            disabled={updating === user.id}
                            className="text-xs gap-1"
                          >
                            {updating === user.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                            Revoke
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => togglePaid(user, true)}
                            disabled={updating === user.id}
                            className="gap-1 bg-green-600 text-xs text-white hover:bg-green-700"
                          >
                            {updating === user.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3.5 w-3.5" />
                            )}
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
