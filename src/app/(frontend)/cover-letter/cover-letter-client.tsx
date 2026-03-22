"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Eye,
  EyeOff,
  User,
  Building2,
  FileText,
  Loader2,
  X,
  Monitor,
  Info,
  FilePen,
  CreditCard,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCoverLetterDocument } from "@/lib/cover-letter-pdf";
import type { CoverLetterFormData } from "@/lib/cover-letter-pdf";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { FREE_GENERATIONS, PAYMENT_CONFIG } from "@/lib/payment-config";
import type { CVUser } from "@/types/database";

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

// ── Style options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS: { key: CoverLetterFormData["styles"]["fontFamily"]; label: string; sub: string; stack: string }[] = [
  { key: "helvetica", label: "Modern",    sub: "Sans-Serif", stack: "system-ui, sans-serif"    },
  { key: "times",     label: "Classic",   sub: "Serif",      stack: "Georgia, serif"            },
  { key: "courier",   label: "Technical", sub: "Monospace",  stack: "ui-monospace, monospace"   },
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

// ── Default & sample data ─────────────────────────────────────────────────────

const defaultData: CoverLetterFormData = {
  styles: {
    fontFamily: "helvetica",
    accentColor: "#6366f1",
  },
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
  },
  recipient: {
    hiringManager: "",
    company: "",
    address: "",
  },
  jobDetails: {
    position: "",
    referenceSource: "",
  },
  letter: {
    opening: "",
    bodyParagraph1: "",
    bodyParagraph2: "",
    bodyParagraph3: "",
    closing: "",
  },
};

const sampleData: CoverLetterFormData = {
  styles: {
    fontFamily: "helvetica",
    accentColor: "#6366f1",
  },
  personal: {
    fullName: "Alex Perera",
    jobTitle: "Full Stack Developer",
    email: "alex.perera@email.com",
    phone: "+94 77 456 7890",
    location: "Colombo, Sri Lanka",
  },
  recipient: {
    hiringManager: "Ms. Emily Chen",
    company: "TechVision Solutions",
    address: "42 Galle Road, Colombo 03, Sri Lanka",
  },
  jobDetails: {
    position: "Senior Full Stack Developer",
    referenceSource: "LinkedIn",
  },
  letter: {
    opening:
      "I am writing to express my strong interest in the Senior Full Stack Developer position at TechVision Solutions, which I discovered on LinkedIn. With over five years of hands-on experience building scalable web applications using modern technologies, I am confident that my technical expertise and collaborative mindset make me an excellent fit for your team.",
    bodyParagraph1:
      "In my current role at InnovateTech, I have led the development of a microservices-based platform serving over 50,000 active users, reducing API response times by 35% through strategic caching and query optimisation. My technical stack spans React, Next.js, Node.js, TypeScript, and PostgreSQL, and I have experience deploying production systems on AWS using Docker and CI/CD pipelines. I consistently advocate for clean, maintainable code and actively mentor junior developers within my team.",
    bodyParagraph2:
      "Beyond technical proficiency, I bring a product-first perspective to engineering. I collaborate closely with designers and stakeholders to translate requirements into intuitive user experiences, and I have a proven track record of delivering features on time in Agile environments. My recent project — a real-time analytics dashboard — was praised by clients for its responsiveness and ease of use, resulting in a contract renewal worth $120,000.",
    bodyParagraph3:
      "TechVision Solutions' reputation for innovation and its investment in developer growth strongly aligns with my professional goals. I am particularly excited about your flagship SaaS product and see significant opportunities to contribute to its next phase of development.",
    closing:
      "I would welcome the opportunity to discuss how my skills and experience can contribute to TechVision Solutions' continued success. Thank you for considering my application — I look forward to hearing from you.",
  },
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

interface TextareaWithCountProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
}

function TextareaWithCount({
  value,
  onChange,
  rows = 4,
  placeholder,
  readOnly,
}: TextareaWithCountProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
      <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
        {value.length} characters
      </p>
    </div>
  );
}

// ── Preview Drawer ────────────────────────────────────────────────────────────

function PreviewDrawer({
  data,
  onClose,
}: {
  data: CoverLetterFormData;
  onClose: () => void;
}) {
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
            <span className="text-sm font-semibold">Cover Letter Preview</span>
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
            <UserCoverLetterDocument data={data} />
          </PDFViewer>
        </div>
      </motion.div>
    </>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────────────

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
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <CreditCard className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold">Unlock Unlimited Cover Letters</h3>
              <p className="text-xs text-muted-foreground">One-time payment of Rs. {PAYMENT_CONFIG.amount}</p>
            </div>
          </div>
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>You&apos;ve used your {FREE_GENERATIONS} free cover letter generations. Make a one-time bank transfer of <strong>Rs. {PAYMENT_CONFIG.amount}</strong> to unlock unlimited access.</span>
          </div>
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bank Transfer Details</h4>
            {[
              { label: "Bank", value: PAYMENT_CONFIG.bankName },
              { label: "Account Name", value: PAYMENT_CONFIG.accountName },
              { label: "Account Number", value: PAYMENT_CONFIG.accountNumber },
              { label: "Branch", value: PAYMENT_CONFIG.branch },
              { label: "Amount", value: `Rs. ${PAYMENT_CONFIG.amount}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{value}</span>
                  <button onClick={() => copy(value, label)} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
                    {copied === label ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            After payment, send your receipt to{" "}
            <a href={`https://wa.me/${PAYMENT_CONFIG.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <MessageCircle className="h-3 w-3" /> WhatsApp
            </a>{" "}
            or{" "}
            <a href={`mailto:${PAYMENT_CONFIG.email}`} className="text-primary hover:underline">{PAYMENT_CONFIG.email}</a>{" "}
            to activate unlimited access.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function CoverLetterClient() {
  const [data, setData] = useState<CoverLetterFormData>(defaultData);
  const [showSample, setShowSample] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [cvUser, setCvUser] = useState<CVUser | null>(null);

  // Load user's cover letter generation count on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("cv_users").select("*").eq("id", user.id).single();
      if (data) setCvUser(data as CVUser);
    });
  }, []);

  // ── Field updaters ──────────────────────────────────────────────────────────

  function setPersonal(k: keyof CoverLetterFormData["personal"], v: string) {
    setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));
  }

  function setRecipient(k: keyof CoverLetterFormData["recipient"], v: string) {
    setData((d) => ({ ...d, recipient: { ...d.recipient, [k]: v } }));
  }

  function setJobDetails(k: keyof CoverLetterFormData["jobDetails"], v: string) {
    setData((d) => ({ ...d, jobDetails: { ...d.jobDetails, [k]: v } }));
  }

  function setLetter(k: keyof CoverLetterFormData["letter"], v: string) {
    setData((d) => ({ ...d, letter: { ...d.letter, [k]: v } }));
  }

  function setStyle(k: keyof CoverLetterFormData["styles"], v: string) {
    if (!showSample) {
      setData((d) => ({ ...d, styles: { ...d.styles, [k]: v } }));
    }
  }

  // ── Download ────────────────────────────────────────────────────────────────

  async function handleDownload() {
    const activeData = showSample ? sampleData : data;

    if (!showSample) {
      const missing: string[] = [];
      if (!activeData.personal.fullName.trim()) missing.push("Full Name");
      if (!activeData.personal.email.trim()) missing.push("Email");
      if (!activeData.recipient.company.trim()) missing.push("Company");
      if (!activeData.jobDetails.position.trim()) missing.push("Position");
      if (missing.length > 0) {
        toast.error("Please fill in required fields: " + missing.join(", "));
        return;
      }
    }

    setGenerating(true);

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeData),
      });

      if (res.status === 401) {
        toast.error("Login required", {
          description: "Please log in to download your cover letter.",
          action: { label: "Log in", onClick: () => (window.location.href = "/auth/login?from=/cover-letter") },
          duration: 6000,
        });
        return;
      }

      if (res.status === 402) {
        setShowPayment(true);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Generation failed" }));
        toast.error(err.error || "Failed to generate cover letter");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match?.[1] ?? "cover-letter.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newCount = parseInt(res.headers.get("X-CL-Generations-Used") ?? "1");
      const isPaid = cvUser?.is_paid ?? false;
      setCvUser((u) => u ? { ...u, cl_generations_used: newCount } : u);
      toast.success(`Cover letter downloaded! (${newCount}/${isPaid ? "∞" : FREE_GENERATIONS} used)`);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const displayData = showSample ? sampleData : data;

  // ── Render ──────────────────────────────────────────────────────────────────

  const clUsed = cvUser?.cl_generations_used ?? 0;
  const isPaid = cvUser?.is_paid ?? false;
  const clRemaining = Math.max(0, FREE_GENERATIONS - clUsed);
  const isLimited = clUsed >= FREE_GENERATIONS && !isPaid;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </AnimatePresence>

      {/* Preview drawer */}
      <AnimatePresence>
        {showPreview && (
          <PreviewDrawer
            data={displayData}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Cover Letter Generator</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Write a professional cover letter and download it as a polished PDF.
              </p>
              {/* Generation counter */}
              {cvUser && (
                <button
                  onClick={() => isLimited && setShowPayment(true)}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors ${
                    isPaid
                      ? "bg-green-500/10 text-green-600 ring-green-500/20"
                      : isLimited
                        ? "bg-red-500/10 text-red-600 ring-red-500/20 cursor-pointer hover:bg-red-500/20"
                        : "bg-primary/10 text-primary ring-primary/20"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  {isPaid ? "Unlimited access" : isLimited ? "Limit reached — click to unlock" : `${clRemaining} free ${clRemaining === 1 ? "generation" : "generations"} left`}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
                Preview
              </Button>

              {/* Download button */}
              <Button
                onClick={handleDownload}
                disabled={generating}
                className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download PDF
              </Button>
            </div>
          </div>

          {/* Sample mode banner */}
          {showSample && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-600 dark:text-blue-400">
              <Info className="h-4 w-4 shrink-0" />
              Sample mode — showing example data. Click &quot;Hide Sample&quot; to
              edit your own cover letter.
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* ── LEFT: Form ── */}
          <div className="min-w-0 flex-1 space-y-6">

            {/* ── 1. Personal Info ── */}
            <Card>
              <SectionHeader icon={User} label="Personal Information" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *">
                  <Input
                    value={displayData.personal.fullName}
                    onChange={(e) => !showSample && setPersonal("fullName", e.target.value)}
                    placeholder="Alex Perera"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Your Job Title">
                  <Input
                    value={displayData.personal.jobTitle}
                    onChange={(e) => !showSample && setPersonal("jobTitle", e.target.value)}
                    placeholder="Full Stack Developer"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Email *">
                  <Input
                    type="email"
                    value={displayData.personal.email}
                    onChange={(e) => !showSample && setPersonal("email", e.target.value)}
                    placeholder="you@email.com"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={displayData.personal.phone}
                    onChange={(e) => !showSample && setPersonal("phone", e.target.value)}
                    placeholder="+94 77 000 0000"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={displayData.personal.location}
                    onChange={(e) => !showSample && setPersonal("location", e.target.value)}
                    placeholder="Colombo, Sri Lanka"
                    readOnly={showSample}
                    className="sm:col-span-2"
                  />
                </Field>
              </div>
            </Card>

            {/* ── 2. Recipient ── */}
            <Card>
              <SectionHeader icon={Building2} label="Recipient" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hiring Manager Name">
                  <Input
                    value={displayData.recipient.hiringManager}
                    onChange={(e) => !showSample && setRecipient("hiringManager", e.target.value)}
                    placeholder="Ms. Emily Chen"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="Company Name *">
                  <Input
                    value={displayData.recipient.company}
                    onChange={(e) => !showSample && setRecipient("company", e.target.value)}
                    placeholder="TechVision Solutions"
                    readOnly={showSample}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Company Address (optional)">
                    <Input
                      value={displayData.recipient.address}
                      onChange={(e) => !showSample && setRecipient("address", e.target.value)}
                      placeholder="42 Galle Road, Colombo 03"
                      readOnly={showSample}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            {/* ── 3. Job Details ── */}
            <Card>
              <SectionHeader icon={FilePen} label="Job Details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Position Applying For *">
                  <Input
                    value={displayData.jobDetails.position}
                    onChange={(e) => !showSample && setJobDetails("position", e.target.value)}
                    placeholder="Senior Full Stack Developer"
                    readOnly={showSample}
                  />
                </Field>
                <Field label="How did you find this role?">
                  <Input
                    value={displayData.jobDetails.referenceSource}
                    onChange={(e) => !showSample && setJobDetails("referenceSource", e.target.value)}
                    placeholder="LinkedIn, company website, referral…"
                    readOnly={showSample}
                  />
                </Field>
              </div>
            </Card>

            {/* ── 4. Letter Content ── */}
            <Card>
              <SectionHeader icon={FileText} label="Letter Content" />
              <div className="space-y-5">

                <div>
                  <FieldLabel>Opening Paragraph *</FieldLabel>
                  <TextareaWithCount
                    value={displayData.letter.opening}
                    onChange={(v) => !showSample && setLetter("opening", v)}
                    rows={4}
                    placeholder="I am writing to express my strong interest in the [Position] role at [Company], which I discovered via [Source]. With [X] years of experience in [field], I am confident I can make a meaningful contribution to your team…"
                    readOnly={showSample}
                  />
                </div>

                <div>
                  <FieldLabel>Body Paragraph 1 — Skills & Experience</FieldLabel>
                  <TextareaWithCount
                    value={displayData.letter.bodyParagraph1}
                    onChange={(v) => !showSample && setLetter("bodyParagraph1", v)}
                    rows={5}
                    placeholder="In my current/previous role at [Company], I [key achievement with metrics]. My core technical skills include [technologies] and I have delivered [specific projects or outcomes]…"
                    readOnly={showSample}
                  />
                </div>

                <div>
                  <FieldLabel>Body Paragraph 2 — Achievements & Impact</FieldLabel>
                  <TextareaWithCount
                    value={displayData.letter.bodyParagraph2}
                    onChange={(v) => !showSample && setLetter("bodyParagraph2", v)}
                    rows={5}
                    placeholder="Beyond technical skills, I bring [soft skills / leadership]. A notable example is [specific project or achievement] which resulted in [measurable outcome]…"
                    readOnly={showSample}
                  />
                </div>

                <div>
                  <FieldLabel>Body Paragraph 3 — Company Fit (optional)</FieldLabel>
                  <TextareaWithCount
                    value={displayData.letter.bodyParagraph3}
                    onChange={(v) => !showSample && setLetter("bodyParagraph3", v)}
                    rows={4}
                    placeholder="[Company]'s commitment to [value/mission] resonates strongly with me. I am particularly excited about [specific product/initiative] and see clear opportunities to [contribute in specific way]…"
                    readOnly={showSample}
                  />
                </div>

                <div>
                  <FieldLabel>Closing Paragraph</FieldLabel>
                  <TextareaWithCount
                    value={displayData.letter.closing}
                    onChange={(v) => !showSample && setLetter("closing", v)}
                    rows={3}
                    placeholder="I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration — I look forward to hearing from you…"
                    readOnly={showSample}
                  />
                </div>

              </div>
            </Card>

          </div>

          {/* ── RIGHT: Sticky Style Panel ── */}
          <div className="w-72 shrink-0 space-y-4 lg:sticky lg:top-24">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Letter Style
              </h3>

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
                      onClick={() => setStyle("fontFamily", f.key)}
                      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                        displayData.styles.fontFamily === f.key
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
                      {displayData.styles.fontFamily === f.key && (
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
                        displayData.styles.accentColor === c.color
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                      style={{
                        backgroundColor: c.color,
                        ...(displayData.styles.accentColor === c.color
                          ? { outlineColor: c.color }
                          : {}),
                      }}
                    >
                      {displayData.styles.accentColor === c.color && (
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
                    style={{ backgroundColor: displayData.styles.accentColor }}
                  />
                  <Input
                    value={displayData.styles.accentColor}
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

              {/* Mini preview */}
              <div className="mt-4 rounded-lg border border-border/60 bg-background p-3">
                <p className="mb-2 text-[10px] text-muted-foreground">Preview</p>
                <div
                  className="border-l-2 pl-2"
                  style={{ borderColor: displayData.styles.accentColor }}
                >
                  <p
                    className="text-[11px] font-bold"
                    style={{
                      fontFamily: FONT_OPTIONS.find(
                        (f) => f.key === displayData.styles.fontFamily
                      )?.stack,
                      color: displayData.styles.accentColor,
                    }}
                  >
                    {displayData.personal.fullName || "Your Name"}
                  </p>
                  <p
                    className="text-[9px] text-muted-foreground"
                    style={{
                      fontFamily: FONT_OPTIONS.find(
                        (f) => f.key === displayData.styles.fontFamily
                      )?.stack,
                    }}
                  >
                    {displayData.personal.jobTitle || "Job Title"}
                  </p>
                  <p
                    className="mt-1 text-[9px] text-muted-foreground"
                    style={{
                      fontFamily: FONT_OPTIONS.find(
                        (f) => f.key === displayData.styles.fontFamily
                      )?.stack,
                    }}
                  >
                    {displayData.recipient.company
                      ? `Re: ${displayData.jobDetails.position || "Position"} at ${displayData.recipient.company}`
                      : "Re: Position · Company"}
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
                Preview Letter
              </Button>
              <Button
                onClick={handleDownload}
                disabled={generating}
                className="mt-2 w-full gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download PDF
              </Button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
