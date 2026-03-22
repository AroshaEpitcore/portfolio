"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff,
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
  AlertCircle,
  CheckCircle,
  Monitor,
  RefreshCw,
  AlignLeft,
  AlignCenter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_CONFIG, FREE_GENERATIONS } from "@/lib/payment-config";
import type { CVFormData, CVStyles, CVUser } from "@/types/database";
import { UserCVDocument } from "@/lib/cv-user-pdf";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// PDFViewer uses browser APIs — must be dynamically imported with ssr:false
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading preview…
      </div>
    ),
  }
);

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
function emptyLang() {
  return { id: uid(), language: "", proficiency: "Fluent" as const };
}
function emptyVolunteer() {
  return { id: uid(), organization: "", role: "", startDate: "", endDate: "", isCurrent: false, description: "" };
}
function emptyRef() {
  return { id: uid(), name: "", company: "", contact: "", available: false };
}
function emptyCustom() {
  return { id: uid(), title: "", content: "" };
}

// ── Style options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS: { key: CVStyles["fontFamily"]; label: string; sub: string; stack: string }[] = [
  { key: "helvetica", label: "Modern",   sub: "Sans-Serif",  stack: "system-ui, sans-serif" },
  { key: "times",     label: "Classic",  sub: "Serif",       stack: "Georgia, serif" },
  { key: "courier",   label: "Technical",sub: "Monospace",   stack: "ui-monospace, monospace" },
];

const DEFAULT_SECTION_ORDER = [
  "experience", "projects", "volunteer", "customSections", "references",
  "education", "skills", "certifications", "languages",
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
  styles: { fontFamily: "helvetica", accentColor: "#6366f1", headerAlign: "left", spacing: "normal", sectionOrder: DEFAULT_SECTION_ORDER },
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
  languages: [{ id: "lang-1", language: "", proficiency: "Fluent" as const }],
  volunteer: [] as Array<{ id: string; organization: string; role: string; startDate: string; endDate: string; isCurrent: boolean; description: string }>,
  references: [{ id: "ref-1", name: "", company: "", contact: "", available: false }],
  customSections: [] as Array<{ id: string; title: string; content: string }>,
};

const sampleData: CVFormData = {
  styles: { fontFamily: "helvetica", accentColor: "#6366f1", headerAlign: "left", spacing: "normal", sectionOrder: DEFAULT_SECTION_ORDER },
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
  languages: [
    { id: "1", language: "English", proficiency: "Fluent" as const },
    { id: "2", language: "Sinhala", proficiency: "Native" as const },
    { id: "3", language: "Tamil", proficiency: "Beginner" as const },
  ],
  volunteer: [
    {
      id: "1",
      organization: "Code for Lanka",
      role: "Volunteer Developer",
      startDate: "2021-06",
      endDate: "2022-01",
      isCurrent: false,
      description: "Built a web platform for NGO operations\nTrained 10 local staff on using the system",
    },
  ],
  references: [
    { id: "1", name: "Jane Cooper", company: "Tech Corp", contact: "jane@techcorp.com", available: false },
    { id: "2", name: "", company: "", contact: "", available: true },
  ],
  customSections: [
    { id: "1", title: "Publications", content: "Co-authored \"Modern Web Development with Next.js\" — TechBooks Publishing, 2023" },
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

// ── Preview Drawer ────────────────────────────────────────────────────────────

function PreviewDrawer({ data, onClose }: { data: CVFormData; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer — slides in from left */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="fixed inset-y-0 left-0 z-50 flex w-full max-w-2xl flex-col border-r border-border bg-card shadow-2xl"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">CV Preview</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PDF viewer fills remaining height */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer
            width="100%"
            height="100%"
            showToolbar={false}
            style={{ border: "none" }}
          >
            <UserCVDocument data={data} />
          </PDFViewer>
        </div>
      </motion.div>
    </>
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
  const [data, setData] = useState<CVFormData>(() => {
    const saved = cvUser?.saved_cv_data as CVFormData | null;
    if (!saved) return defaultData;
    return {
      ...defaultData,
      ...saved,
      languages: saved.languages ?? defaultData.languages,
      volunteer: saved.volunteer ?? defaultData.volunteer,
      references: saved.references ?? defaultData.references,
      customSections: saved.customSections ?? defaultData.customSections,
    };
  });
  const [showSample, setShowSample] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generationsUsed = cvUser?.generations_used ?? 0;
  const isPaid = cvUser?.is_paid ?? false;
  const remaining = Math.max(0, FREE_GENERATIONS - generationsUsed);
  const isLimited = generationsUsed >= FREE_GENERATIONS && !isPaid;

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showValidation, setShowValidation] = useState(false);

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
      | "languages"
      | "volunteer"
      | "references"
      | "customSections"
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
      | "languages"
      | "volunteer"
      | "references"
      | "customSections"
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
      | "languages"
      | "volunteer"
      | "references"
      | "customSections"
  >(key: K, id: string) {
    setData((d) => ({
      ...d,
      [key]: (d[key] as Array<{ id: string }>).filter((i) => i.id !== id),
    }));
  }

  function setStyle<K extends keyof CVStyles>(key: K, value: CVStyles[K]) {
    if (!showSample) setData((d) => ({ ...d, styles: { ...d.styles, [key]: value } }));
  }

  // ── Auto-save ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user || showSample) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");
    saveTimerRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("cv_users")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ saved_cv_data: data as any, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (!error) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("idle");
      }
    }, 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data, user, showSample]);

  // ── Generate ───────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (isLimited) {
      setShowPayment(true);
      return;
    }
    if (!showSample) {
      const missing: string[] = [];
      if (!data.personal.fullName.trim()) missing.push("Full Name");
      if (!data.personal.jobTitle.trim()) missing.push("Job Title");
      if (!data.personal.email.trim()) missing.push("Email");
      if (missing.length > 0) {
        setShowValidation(true);
        toast.error("Please fill in required fields: " + missing.join(", "));
        document.getElementById("personal-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    setGenerating(true);

    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showSample ? sampleData : data),
      });

      if (res.status === 401) {
        toast.error("Login required", {
          description: "Please create an account or log in to generate your CV.",
          action: { label: "Log in", onClick: () => window.location.href = "/auth/login?from=/cv-generator" },
          duration: 6000,
        });
        setGenerating(false);
        return;
      }
      if (res.status === 402) {
        setShowPayment(true);
        setGenerating(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Generation failed");
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

      const newCount = parseInt(res.headers.get("X-Generations-Used") ?? "1");
      toast.success(`CV downloaded! (${newCount}/${isPaid ? "∞" : FREE_GENERATIONS} used)`);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="cv-generator-page min-h-screen bg-background pt-20">
      {/* Preview drawer */}
      <AnimatePresence>
        {showPreview && (
          <PreviewDrawer
            data={showSample ? sampleData : data}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </AnimatePresence>


      {/* Page header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">CV Generator</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your details and download an ATS-optimized CV PDF.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Auto-save indicator */}
              {saveStatus !== "idle" && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {saveStatus === "saving" ? (
                    <><RefreshCw className="h-3 w-3 animate-spin" /> Saving…</>
                  ) : (
                    <><CheckCircle className="h-3 w-3 text-green-500" /> Saved</>
                  )}
                </span>
              )}

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

              {/* Preview button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Monitor className="h-3.5 w-3.5" />
                Preview CV
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
          <div id="personal-section">
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
                className={showValidation && !data.personal.fullName.trim() && !showSample ? "ring-2 ring-red-500/70 border-red-500/70" : ""}
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
                className={showValidation && !data.personal.jobTitle.trim() && !showSample ? "ring-2 ring-red-500/70 border-red-500/70" : ""}
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
                className={showValidation && !data.personal.email.trim() && !showSample ? "ring-2 ring-red-500/70 border-red-500/70" : ""}
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

        {/* ── Languages ── */}
        <Card>
          <SectionHeader icon={FileText} label="Languages" />
          <div className="space-y-3">
            {(showSample ? sampleData.languages : data.languages).map((lang) => (
              <div key={lang.id} className="relative flex items-center gap-3">
                {!showSample && data.languages.length > 1 && (
                  <button
                    onClick={() => removeItem("languages", lang.id)}
                    className="absolute -right-1 -top-1 rounded-full p-0.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="flex-1">
                  <Input
                    value={lang.language}
                    onChange={(e) => !showSample && updateList("languages", lang.id, "language", e.target.value)}
                    placeholder="e.g. English, Sinhala, Tamil"
                    readOnly={showSample}
                  />
                </div>
                <select
                  value={lang.proficiency}
                  onChange={(e) => !showSample && updateList("languages", lang.id, "proficiency", e.target.value)}
                  disabled={showSample}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {["Beginner", "Intermediate", "Fluent", "Native"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton onClick={() => addItem("languages", emptyLang)} label="Add Language" />
          )}
        </Card>

        {/* ── Volunteer / Extra-Curricular ── */}
        <Card>
          <SectionHeader icon={Award} label="Volunteer & Extra-Curricular" />
          <div className="space-y-4">
            {(showSample ? sampleData.volunteer : data.volunteer).map((vol, i) => (
              <div key={vol.id} className="relative rounded-xl border border-border/60 bg-background p-4">
                {!showSample && data.volunteer.length > 0 && (
                  <button
                    onClick={() => removeItem("volunteer", vol.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="mb-1 text-xs font-semibold text-muted-foreground">
                  Entry #{i + 1}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Organisation">
                    <Input
                      value={vol.organization}
                      onChange={(e) => !showSample && updateList("volunteer", vol.id, "organization", e.target.value)}
                      placeholder="Code for Lanka"
                      readOnly={showSample}
                    />
                  </Field>
                  <Field label="Role">
                    <Input
                      value={vol.role}
                      onChange={(e) => !showSample && updateList("volunteer", vol.id, "role", e.target.value)}
                      placeholder="Volunteer Developer"
                      readOnly={showSample}
                    />
                  </Field>
                  <Field label="Start Date">
                    <Input
                      type="month"
                      value={vol.startDate}
                      onChange={(e) => !showSample && updateList("volunteer", vol.id, "startDate", e.target.value)}
                      readOnly={showSample}
                    />
                  </Field>
                  <Field label="End Date">
                    <Input
                      type="month"
                      value={vol.endDate}
                      onChange={(e) => !showSample && updateList("volunteer", vol.id, "endDate", e.target.value)}
                      readOnly={showSample || vol.isCurrent}
                    />
                  </Field>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      id={`vol-current-${vol.id}`}
                      checked={vol.isCurrent}
                      onChange={(e) => !showSample && updateList("volunteer", vol.id, "isCurrent", e.target.checked)}
                      disabled={showSample}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor={`vol-current-${vol.id}`} className="text-xs text-muted-foreground">
                      Currently active
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <Field label="Description">
                    <Textarea
                      value={vol.description}
                      onChange={(v) => !showSample && updateList("volunteer", vol.id, "description", v)}
                      placeholder="Describe your contributions…"
                      rows={2}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton onClick={() => addItem("volunteer", emptyVolunteer)} label="Add Volunteer Entry" />
          )}
        </Card>

        {/* ── References ── */}
        <Card>
          <SectionHeader icon={User} label="References" />
          <div className="space-y-4">
            {(showSample ? sampleData.references : data.references).map((ref) => (
              <div key={ref.id} className="relative rounded-xl border border-border/60 bg-background p-4">
                {!showSample && data.references.length > 1 && (
                  <button
                    onClick={() => removeItem("references", ref.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`ref-avail-${ref.id}`}
                    checked={ref.available}
                    onChange={(e) => !showSample && updateList("references", ref.id, "available", e.target.checked)}
                    disabled={showSample}
                    className="h-4 w-4 rounded border-border"
                  />
                  <label htmlFor={`ref-avail-${ref.id}`} className="text-xs font-medium text-muted-foreground">
                    Available on request
                  </label>
                </div>
                {!ref.available && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Full Name">
                      <Input
                        value={ref.name}
                        onChange={(e) => !showSample && updateList("references", ref.id, "name", e.target.value)}
                        placeholder="Jane Cooper"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Company">
                      <Input
                        value={ref.company}
                        onChange={(e) => !showSample && updateList("references", ref.id, "company", e.target.value)}
                        placeholder="Tech Corp"
                        readOnly={showSample}
                      />
                    </Field>
                    <Field label="Email / Phone">
                      <Input
                        value={ref.contact}
                        onChange={(e) => !showSample && updateList("references", ref.id, "contact", e.target.value)}
                        placeholder="jane@techcorp.com or +94 77 000 0000"
                        readOnly={showSample}
                      />
                    </Field>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton onClick={() => addItem("references", emptyRef)} label="Add Reference" />
          )}
        </Card>

        {/* ── Custom Sections ── */}
        <Card>
          <SectionHeader icon={FileText} label="Custom Sections" />
          <p className="mb-4 text-xs text-muted-foreground -mt-3">
            Add any extra sections — Publications, Awards, Hobbies, etc.
          </p>
          <div className="space-y-4">
            {(showSample ? sampleData.customSections : data.customSections).map((cs, i) => (
              <div key={cs.id} className="relative rounded-xl border border-border/60 bg-background p-4">
                {!showSample && data.customSections.length > 0 && (
                  <button
                    onClick={() => removeItem("customSections", cs.id)}
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="mb-1 text-xs font-semibold text-muted-foreground">Section #{i + 1}</div>
                <div className="space-y-3">
                  <Field label="Section Title">
                    <Input
                      value={cs.title}
                      onChange={(e) => !showSample && updateList("customSections", cs.id, "title", e.target.value)}
                      placeholder="Publications, Awards, Hobbies…"
                      readOnly={showSample}
                    />
                  </Field>
                  <Field label="Content">
                    <Textarea
                      value={cs.content}
                      onChange={(v) => !showSample && updateList("customSections", cs.id, "content", v)}
                      placeholder="Describe or list items here…"
                      rows={3}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          {!showSample && (
            <AddButton onClick={() => addItem("customSections", emptyCustom)} label="Add Custom Section" />
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
            <div className="mb-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Font Family
              </p>
              <div className="space-y-1">
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
                    className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                      data.styles.fontFamily === f.key
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <span
                      style={{ fontFamily: f.stack }}
                      className="w-7 text-center text-sm font-bold"
                    >
                      Aa
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{f.label}</p>
                      <p className="text-[10px] text-muted-foreground">{f.sub}</p>
                    </div>
                    {data.styles.fontFamily === f.key && (
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div className="mb-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Accent Color
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    title={c.label}
                    onClick={() => setStyle("accentColor", c.color)}
                    className={`relative h-7 w-full rounded-md transition-all hover:scale-105 ${
                      data.styles.accentColor === c.color
                        ? "ring-2 ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                    style={{
                      backgroundColor: c.color,
                      ...(data.styles.accentColor === c.color ? { outlineColor: c.color } : {}),
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
              {/* Hex color input */}
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="h-7 w-7 shrink-0 rounded border border-border"
                  style={{ backgroundColor: data.styles.accentColor }}
                />
                <Input
                  value={data.styles.accentColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                      setStyle("accentColor", v);
                    }
                  }}
                  placeholder="#6366f1"
                  className="h-7 flex-1 font-mono text-xs"
                  readOnly={showSample}
                />
              </div>
            </div>

            {/* Header align */}
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Header Alignment
              </p>
              <div className="flex gap-2">
                {(["left", "center"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setStyle("headerAlign", align)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs transition-all ${
                      (data.styles.headerAlign ?? "left") === align
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {align === "left" ? <AlignLeft className="h-3.5 w-3.5" /> : <AlignCenter className="h-3.5 w-3.5" />}
                    {align === "left" ? "Left" : "Center"}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Spacing
              </p>
              <div className="flex gap-1.5">
                {(["compact", "normal", "spacious"] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setStyle("spacing", sp)}
                    className={`flex-1 rounded-lg border py-1.5 text-[10px] capitalize transition-all ${
                      (data.styles.spacing ?? "normal") === sp
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
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

            {/* Preview + Download CTAs */}
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="mt-5 w-full gap-2"
            >
              <Monitor className="h-4 w-4" />
              Preview CV
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-2 w-full gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
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
