"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  FileText,
  Loader2,
  CreditCard,
  X,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_CONFIG, FREE_GENERATIONS } from "@/lib/payment-config";
import type { CVFormData, CVStyles, CVUser } from "@/types/database";

// ── helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyExp() {
  return {
    id: uid(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  };
}
function emptyEdu() {
  return {
    id: uid(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    grade: "",
  };
}
function emptySkill() {
  return { id: uid(), category: "", items: "" };
}
function emptyProject() {
  return { id: uid(), name: "", description: "", techStack: "", url: "" };
}
function emptyCert() {
  return { id: uid(), name: "", issuer: "", date: "", url: "" };
}

// ── Style options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS: { key: CVStyles["fontFamily"]; label: string; sub: string; stack: string }[] = [
  { key: "helvetica", label: "Modern",   sub: "Sans-Serif",  stack: "system-ui, sans-serif" },
  { key: "times",     label: "Classic",  sub: "Serif",       stack: "Georgia, serif" },
  { key: "courier",   label: "Technical",sub: "Monospace",   stack: "ui-monospace, monospace" },
];

const COLOR_OPTIONS: { color: string; label: string }[] = [
  { color: "#6366f1", label: "Indigo"   },
  { color: "#2563eb", label: "Blue"     },
  { color: "#059669", label: "Emerald"  },
  { color: "#dc2626", label: "Red"      },
  { color: "#7c3aed", label: "Violet"   },
  { color: "#b45309", label: "Amber"    },
  { color: "#0f172a", label: "Charcoal" },
];

const defaultData: CVFormData = {
  styles: { fontFamily: "helvetica", accentColor: "#6366f1" },
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  experience: [{ id: "exp-1", company: "", position: "", startDate: "", endDate: "", isCurrent: false, description: "" }],
  education: [{ id: "edu-1", institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", isCurrent: false, grade: "" }],
  skills: [{ id: "sk-1", category: "", items: "" }],
  projects: [{ id: "proj-1", name: "", description: "", techStack: "", url: "" }],
  certifications: [{ id: "cert-1", name: "", issuer: "", date: "", url: "" }],
};

const sampleData: CVFormData = {
  styles: { fontFamily: "helvetica", accentColor: "#6366f1" },
  personal: {
    fullName: "Sarah Johnson",
    jobTitle: "Full Stack Developer",
    email: "sarah@example.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson",
    website: "https://sarahjohnson.dev",
  },
  summary:
    "Passionate full-stack developer with 3+ years building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Delivered 20+ projects with measurable business impact.",
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Frontend Developer",
      startDate: "2022-01",
      endDate: "",
      isCurrent: true,
      description:
        "Led development of React-based dashboard used by 10,000+ users\nReduced page load time by 40% through optimization\nMentored 3 junior developers",
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2020-06",
      endDate: "2021-12",
      isCurrent: false,
      description:
        "Built REST APIs with Node.js and Express\nDesigned PostgreSQL database schema\nDeployed applications on AWS",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Colombo",
      degree: "BSc",
      fieldOfStudy: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-06",
      isCurrent: false,
      grade: "First Class Honours",
    },
  ],
  skills: [
    { id: "1", category: "Frontend", items: "React, Next.js, TypeScript, Tailwind CSS" },
    { id: "2", category: "Backend", items: "Node.js, Express, PostgreSQL, REST APIs" },
    { id: "3", category: "Tools", items: "Git, Docker, AWS, Vercel, Figma" },
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      techStack: "Next.js, Node.js, PostgreSQL, Stripe",
      url: "https://example.com",
    },
    {
      id: "2",
      name: "Task Management App",
      description: "Real-time collaborative task manager with team features",
      techStack: "React, Socket.io, MongoDB",
      url: "https://github.com/example/tasks",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-03",
      url: "https://aws.amazon.com",
    },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground">{label}</h3>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-muted-foreground">
      {children}
    </label>
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
    />
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

// ── Payment Modal ────────────────────────────────────────────────────────────

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <CreditCard className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold">Unlock Unlimited CVs</h3>
              <p className="text-xs text-muted-foreground">
                One-time payment of Rs. {PAYMENT_CONFIG.amount}
              </p>
            </div>
          </div>

          {/* Limit message */}
          <div className="mb-5 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertCircle className="mb-1 h-4 w-4" />
            You&apos;ve used your {FREE_GENERATIONS} free CV generations. Make a
            one-time bank transfer of{" "}
            <strong>Rs. {PAYMENT_CONFIG.amount}</strong> to unlock unlimited
            access.
          </div>

          {/* Bank details */}
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Bank Transfer Details
            </h4>

            {[
              { label: "Bank", value: PAYMENT_CONFIG.bankName },
              { label: "Account Name", value: PAYMENT_CONFIG.accountName },
              {
                label: "Account Number",
                value: PAYMENT_CONFIG.accountNumber,
                copyKey: "acc",
              },
              { label: "Branch", value: PAYMENT_CONFIG.branch },
              {
                label: "Amount",
                value: `Rs. ${PAYMENT_CONFIG.amount} (LKR)`,
              },
              {
                label: "Reference",
                value: "Your email address",
                note: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4"
              >
                <span className="text-xs text-muted-foreground shrink-0">
                  {row.label}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-right text-xs font-medium ${
                      row.note ? "text-primary" : ""
                    }`}
                  >
                    {row.value}
                  </span>
                  {row.copyKey && (
                    <button
                      onClick={() => copy(row.value, row.copyKey!)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copied === row.copyKey ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* After payment */}
          <div className="mt-4 rounded-xl border border-border bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
            <Info className="mb-1 h-3.5 w-3.5 text-primary" />
            After payment, send your bank slip to{" "}
            <a
              href={`https://wa.me/${PAYMENT_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              WhatsApp <ExternalLink className="h-3 w-3" />
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${PAYMENT_CONFIG.email}`}
              className="font-medium text-primary hover:underline"
            >
              {PAYMENT_CONFIG.email}
            </a>
            . Access will be activated within 24 hours by admin.
          </div>

          <Button onClick={onClose} variant="outline" className="mt-4 w-full">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  user: { id: string; email: string; name?: string } | null;
  cvUser: CVUser | null;
}

export function CVGeneratorClient({ user, cvUser }: Props) {
  const [data, setData] = useState<CVFormData>(defaultData);
  const [showSample, setShowSample] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [genError, setGenError] = useState("");

  const generationsUsed = cvUser?.generations_used ?? 0;
  const isPaid = cvUser?.is_paid ?? false;
  const remaining = Math.max(0, FREE_GENERATIONS - generationsUsed);
  const isLimited = generationsUsed >= FREE_GENERATIONS && !isPaid;

  // Suppress unused variable warning — user prop available for future personalization
  void user;

  // ── Field updaters ─────────────────────────────────────────────────────────

  function setPersonal(k: keyof CVFormData["personal"], v: string) {
    setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));
  }

  function updateList<
    K extends
      | "experience"
      | "education"
      | "skills"
      | "projects"
      | "certifications"
  >(key: K, id: string, field: string, value: unknown) {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string }>).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addItem<
    K extends
      | "experience"
      | "education"
      | "skills"
      | "projects"
      | "certifications"
  >(key: K, factory: () => object) {
    setData((d) => ({ ...d, [key]: [...(d[key] as object[]), factory()] }));
  }

  function removeItem<
    K extends
      | "experience"
      | "education"
      | "skills"
      | "projects"
      | "certifications"
  >(key: K, id: string) {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string }>).filter((i) => i.id !== id),
    }));
  }

  // ── Generate ───────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (isLimited) {
      setShowPayment(true);
      return;
    }
    setGenerating(true);
    setGenError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showSample ? sampleData : data),
      });

      if (res.status === 402) {
        setShowPayment(true);
        setGenerating(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        setGenError(err.error || "Generation failed");
        setGenerating(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newCount = parseInt(
        res.headers.get("X-Generations-Used") ?? "1"
      );
      setSuccessMsg(
        `CV downloaded! (${newCount}/${isPaid ? "∞" : FREE_GENERATIONS} used)`
      );
    } catch {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </AnimatePresence>

      {/* Page header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">CV Generator</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your details and download an ATS-optimized CV PDF.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Usage badge */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
                  isPaid
                    ? "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400"
                    : remaining === 0
                    ? "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400"
                    : "bg-primary/10 text-primary ring-primary/20"
                }`}
              >
                {isPaid
                  ? "✓ Unlimited access"
                  : `${remaining} free generation${remaining !== 1 ? "s" : ""} left`}
              </div>

              {/* Sample toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSample(!showSample)}
                className="gap-2"
              >
                {showSample ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                {showSample ? "Hide Sample" : "View Sample"}
              </Button>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isLimited ? "Unlock — Rs. 250" : "Download CV"}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400"
            >
              <CheckCircle className="h-4 w-4" />
              {successMsg}
            </motion.div>
          )}
          {genError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              {genError}
            </motion.div>
          )}

          {/* Sample mode banner */}
          {showSample && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-600 dark:text-blue-400">
              <Info className="h-4 w-4 shrink-0" />
              Sample mode — showing example data. Click &quot;Hide Sample&quot;
              to edit your own CV.
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* ── LEFT: Form ── */}
          <div className="min-w-0 flex-1 space-y-6">

        {/* ── Personal Info ── */}
        <Card>
          <SectionHeader icon={User} label="Personal Information" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *">
              <Input
                value={
                  showSample
                    ? sampleData.personal.fullName
                    : data.personal.fullName
                }
                onChange={(e) =>
                  !showSample && setPersonal("fullName", e.target.value)
                }
                placeholder="John Doe"
                readOnly={showSample}
              />
            </Field>
            <Field label="Job Title *">
              <Input
                value={
                  showSample
                    ? sampleData.personal.jobTitle
                    : data.personal.jobTitle
                }
                onChange={(e) =>
                  !showSample && setPersonal("jobTitle", e.target.value)
                }
                placeholder="Full Stack Developer"
                readOnly={showSample}
              />
            </Field>
            <Field label="Email *">
              <Input
                type="email"
                value={
                  showSample ? sampleData.personal.email : data.personal.email
                }
                onChange={(e) =>
                  !showSample && setPersonal("email", e.target.value)
                }
                placeholder="you@email.com"
                readOnly={showSample}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={
                  showSample ? sampleData.personal.phone : data.personal.phone
                }
                onChange={(e) =>
                  !showSample && setPersonal("phone", e.target.value)
                }
                placeholder="+94 77 000 0000"
                readOnly={showSample}
              />
            </Field>
            <Field label="Location">
              <Input
                value={
                  showSample
                    ? sampleData.personal.location
                    : data.personal.location
                }
                onChange={(e) =>
                  !showSample && setPersonal("location", e.target.value)
                }
                placeholder="Colombo, Sri Lanka"
                readOnly={showSample}
              />
            </Field>
            <Field label="LinkedIn URL">
              <Input
                value={
                  showSample
                    ? sampleData.personal.linkedin
                    : data.personal.linkedin
                }
                onChange={(e) =>
                  !showSample && setPersonal("linkedin", e.target.value)
                }
                placeholder="https://linkedin.com/in/..."
                readOnly={showSample}
              />
            </Field>
            <Field label="GitHub URL">
              <Input
                value={
                  showSample ? sampleData.personal.github : data.personal.github
                }
                onChange={(e) =>
                  !showSample && setPersonal("github", e.target.value)
                }
                placeholder="https://github.com/..."
                readOnly={showSample}
              />
            </Field>
            <Field label="Portfolio / Website">
              <Input
                value={
                  showSample
                    ? sampleData.personal.website
                    : data.personal.website
                }
                onChange={(e) =>
                  !showSample && setPersonal("website", e.target.value)
                }
                placeholder="https://yoursite.com"
                readOnly={showSample}
              />
            </Field>
          </div>
        </Card>

        {/* ── Summary ── */}
        <Card>
          <SectionHeader icon={FileText} label="Professional Summary" />
          <FieldLabel>
            A brief overview of your professional background (2-4 sentences)
          </FieldLabel>
          <Textarea
            value={showSample ? sampleData.summary : data.summary}
            onChange={(v) =>
              !showSample && setData((d) => ({ ...d, summary: v }))
            }
            rows={4}
            placeholder="Passionate developer with X years of experience..."
          />
        </Card>

        {/* ── Experience ── */}
        <Card>
          <SectionHeader icon={Briefcase} label="Work Experience" />
          <div className="space-y-5">
            {(showSample ? sampleData.experience : data.experience).map(
              (exp, i) => (
                <div
                  key={exp.id}
                  className="relative rounded-xl border border-border/60 bg-background p-4"
                >
                  {!showSample && data.experience.length > 1 && (
                    <button
                      onClick={() => removeItem("experience", exp.id)}
                      className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">
                    Experience #{i + 1}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Company">
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "experience",
                            exp.id,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company Name"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Position">
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "experience",
                            exp.id,
                            "position",
                            e.target.value
                          )
                        }
                        placeholder="Software Engineer"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Start Date">
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "experience",
                            exp.id,
                            "startDate",
                            e.target.value
                          )
                        }
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="End Date">
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "experience",
                            exp.id,
                            "endDate",
                            e.target.value
                          )
                        }
                        disabled={exp.isCurrent}
                        readOnly={showSample}
                      />
                    </Field>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`curr-${exp.id}`}
                        checked={exp.isCurrent}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "experience",
                            exp.id,
                            "isCurrent",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-border"
                        readOnly={showSample}
                      />
                      <label
                        htmlFor={`curr-${exp.id}`}
                        className="text-sm text-muted-foreground"
                      >
                        Currently working here
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Responsibilities (one per line or use bullet points)">
                        <Textarea
                          value={exp.description}
                          onChange={(v) =>
                            !showSample &&
                            updateList("experience", exp.id, "description", v)
                          }
                          rows={4}
                          placeholder="• Led team of 5 developers&#10;• Built REST APIs&#10;• Improved performance by 40%"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {!showSample && (
            <AddButton
              onClick={() => addItem("experience", emptyExp)}
              label="Add Experience"
            />
          )}
        </Card>

        {/* ── Education ── */}
        <Card>
          <SectionHeader icon={GraduationCap} label="Education" />
          <div className="space-y-5">
            {(showSample ? sampleData.education : data.education).map(
              (edu, i) => (
                <div
                  key={edu.id}
                  className="relative rounded-xl border border-border/60 bg-background p-4"
                >
                  {!showSample && data.education.length > 1 && (
                    <button
                      onClick={() => removeItem("education", edu.id)}
                      className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">
                    Education #{i + 1}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Institution">
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="University of Colombo"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Degree">
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "degree",
                            e.target.value
                          )
                        }
                        placeholder="BSc / MBA / Diploma"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Field of Study">
                      <Input
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "fieldOfStudy",
                            e.target.value
                          )
                        }
                        placeholder="Computer Science"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Grade / GPA">
                      <Input
                        value={edu.grade}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "grade",
                            e.target.value
                          )
                        }
                        placeholder="First Class / 3.8 GPA"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Start Date">
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "startDate",
                            e.target.value
                          )
                        }
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="End Date">
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "endDate",
                            e.target.value
                          )
                        }
                        disabled={edu.isCurrent}
                        readOnly={showSample}
                      />
                    </Field>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`edu-curr-${edu.id}`}
                        checked={edu.isCurrent}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "education",
                            edu.id,
                            "isCurrent",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-border"
                        readOnly={showSample}
                      />
                      <label
                        htmlFor={`edu-curr-${edu.id}`}
                        className="text-sm text-muted-foreground"
                      >
                        Currently studying
                      </label>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {!showSample && (
            <AddButton
              onClick={() => addItem("education", emptyEdu)}
              label="Add Education"
            />
          )}
        </Card>

        {/* ── Skills ── */}
        <Card>
          <SectionHeader icon={Code2} label="Skills" />
          <p className="mb-4 text-xs text-muted-foreground">
            Group your skills by category. Comma-separate the skill names.
          </p>
          <div className="space-y-4">
            {(showSample ? sampleData.skills : data.skills).map((group) => (
              <div
                key={group.id}
                className="relative grid gap-3 rounded-xl border border-border/60 bg-background p-4 sm:grid-cols-[1fr_2fr]"
              >
                {!showSample && data.skills.length > 1 && (
                  <button
                    onClick={() => removeItem("skills", group.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <Field label="Category">
                  <Input
                    value={group.category}
                    onChange={(e) =>
                      !showSample &&
                      updateList("skills", group.id, "category", e.target.value)
                    }
                    placeholder="Frontend"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Skills (comma-separated)">
                  <Input
                    value={group.items}
                    onChange={(e) =>
                      !showSample &&
                      updateList("skills", group.id, "items", e.target.value)
                    }
                    placeholder="React, TypeScript, Tailwind CSS"
                    readOnly={showSample}
                  />
                </Field>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton
              onClick={() => addItem("skills", emptySkill)}
              label="Add Skill Group"
            />
          )}
        </Card>

        {/* ── Projects ── */}
        <Card>
          <SectionHeader icon={FolderKanban} label="Projects" />
          <div className="space-y-5">
            {(showSample ? sampleData.projects : data.projects).map((p, i) => (
              <div
                key={p.id}
                className="relative rounded-xl border border-border/60 bg-background p-4"
              >
                {!showSample && data.projects.length > 1 && (
                  <button
                    onClick={() => removeItem("projects", p.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="mb-1 text-xs font-semibold text-muted-foreground">
                  Project #{i + 1}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Project Name">
                    <Input
                      value={p.name}
                      onChange={(e) =>
                        !showSample &&
                        updateList("projects", p.id, "name", e.target.value)
                      }
                      placeholder="My Awesome App"
                      readOnly={showSample}
                    />
                  </Field>
                  <Field label="Live URL / GitHub">
                    <Input
                      value={p.url}
                      onChange={(e) =>
                        !showSample &&
                        updateList("projects", p.id, "url", e.target.value)
                      }
                      placeholder="https://..."
                      readOnly={showSample}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Tech Stack">
                      <Input
                        value={p.techStack}
                        onChange={(e) =>
                          !showSample &&
                          updateList(
                            "projects",
                            p.id,
                            "techStack",
                            e.target.value
                          )
                        }
                        placeholder="React, Node.js, PostgreSQL"
                        readOnly={showSample}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <Textarea
                        value={p.description}
                        onChange={(v) =>
                          !showSample &&
                          updateList("projects", p.id, "description", v)
                        }
                        rows={2}
                        placeholder="Brief description of what you built and its impact"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton
              onClick={() => addItem("projects", emptyProject)}
              label="Add Project"
            />
          )}
        </Card>

        {/* ── Certifications ── */}
        <Card>
          <SectionHeader icon={Award} label="Certifications & Awards" />
          <div className="space-y-4">
            {(showSample
              ? sampleData.certifications
              : data.certifications
            ).map((cert) => (
              <div
                key={cert.id}
                className="relative grid gap-3 rounded-xl border border-border/60 bg-background p-4 sm:grid-cols-2"
              >
                {!showSample && data.certifications.length > 1 && (
                  <button
                    onClick={() => removeItem("certifications", cert.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <Field label="Certification Name">
                  <Input
                    value={cert.name}
                    onChange={(e) =>
                      !showSample &&
                      updateList(
                        "certifications",
                        cert.id,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="AWS Certified Developer"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Issuer">
                  <Input
                    value={cert.issuer}
                    onChange={(e) =>
                      !showSample &&
                      updateList(
                        "certifications",
                        cert.id,
                        "issuer",
                        e.target.value
                      )
                    }
                    placeholder="Amazon Web Services"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Date Issued">
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) =>
                      !showSample &&
                      updateList(
                        "certifications",
                        cert.id,
                        "date",
                        e.target.value
                      )
                    }
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Credential URL">
                  <Input
                    value={cert.url}
                    onChange={(e) =>
                      !showSample &&
                      updateList(
                        "certifications",
                        cert.id,
                        "url",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    readOnly={showSample}
                  />
                </Field>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton
              onClick={() => addItem("certifications", emptyCert)}
              label="Add Certification"
            />
          )}
        </Card>

        {/* ── Generate button (bottom of left col) ── */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-accent px-8 text-white hover:opacity-90 shadow-lg shadow-primary/20"
          >
            {generating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {isLimited ? "Unlock for Rs. 250" : "Download My CV as PDF"}
          </Button>
        </div>
        </div>

        {/* ── RIGHT: Sticky Style Panel ── */}
        <div className="w-72 shrink-0 space-y-4 lg:sticky lg:top-24">
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-foreground">CV Style</h3>

            {/* Font family */}
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Font Family
              </p>
              <div className="space-y-2">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() =>
                      !showSample &&
                      setData((d) => ({
                        ...d,
                        styles: { ...d.styles, fontFamily: f.key },
                      }))
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                      data.styles.fontFamily === f.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <span
                      style={{ fontFamily: f.stack }}
                      className="w-8 text-center text-base font-bold"
                    >
                      Aa
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground">{f.sub}</p>
                    </div>
                    {data.styles.fontFamily === f.key && (
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Accent Color
              </p>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    title={c.label}
                    onClick={() =>
                      !showSample &&
                      setData((d) => ({
                        ...d,
                        styles: { ...d.styles, accentColor: c.color },
                      }))
                    }
                    className={`relative h-9 w-full rounded-lg transition-all hover:scale-105 ${
                      data.styles.accentColor === c.color
                        ? "ring-2 ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                    style={{
                      backgroundColor: c.color,
                      ...(data.styles.accentColor === c.color
                        ? { outlineColor: c.color }
                        : {}),
                    }}
                  >
                    {data.styles.accentColor === c.color && (
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p
                className="mt-2 text-center text-[10px] font-medium"
                style={{ color: data.styles.accentColor }}
              >
                {COLOR_OPTIONS.find((c) => c.color === data.styles.accentColor)?.label ?? "Custom"}
              </p>
            </div>

            {/* Mini preview */}
            <div className="mt-5 rounded-lg border border-border/60 bg-background p-3">
              <p className="mb-2 text-[10px] text-muted-foreground">Preview</p>
              <div
                className="border-l-2 pl-2"
                style={{ borderColor: data.styles.accentColor }}
              >
                <p
                  className="text-[11px] font-bold"
                  style={{
                    fontFamily: FONT_OPTIONS.find((f) => f.key === data.styles.fontFamily)?.stack,
                    color: data.styles.accentColor,
                  }}
                >
                  Your Name
                </p>
                <p
                  className="text-[9px] text-muted-foreground"
                  style={{
                    fontFamily: FONT_OPTIONS.find((f) => f.key === data.styles.fontFamily)?.stack,
                  }}
                >
                  Job Title
                </p>
                <p
                  className="mt-1 text-[9px] text-muted-foreground"
                  style={{
                    fontFamily: FONT_OPTIONS.find((f) => f.key === data.styles.fontFamily)?.stack,
                  }}
                >
                  Experience · Education · Skills
                </p>
              </div>
            </div>

            {/* Sticky generate CTA */}
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-5 w-full gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isLimited ? "Unlock — Rs. 250" : "Download PDF"}
            </Button>
          </Card>
        </div>

      </div>
    </div>
  </div>
  );
}
