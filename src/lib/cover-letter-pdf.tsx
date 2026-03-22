import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

// ── Interface ────────────────────────────────────────────────────────────────

export interface CoverLetterFormData {
  styles: {
    fontFamily: "helvetica" | "times" | "courier";
    accentColor: string;
  };
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
  };
  recipient: {
    hiringManager: string;
    company: string;
    address: string;
  };
  jobDetails: {
    position: string;
    referenceSource: string;
  };
  letter: {
    opening: string;
    bodyParagraph1: string;
    bodyParagraph2: string;
    bodyParagraph3: string;
    closing: string;
  };
}

// ── Font maps (built-in PDF fonts) ───────────────────────────────────────────

const FONT_MAP = {
  helvetica: { reg: "Helvetica",   bold: "Helvetica-Bold",  italic: "Helvetica-Oblique" },
  times:     { reg: "Times-Roman", bold: "Times-Bold",      italic: "Times-Italic"      },
  courier:   { reg: "Courier",     bold: "Courier-Bold",    italic: "Courier-Oblique"   },
} as const;

// ── Style builder ─────────────────────────────────────────────────────────────

function buildStyles(fontKey: keyof typeof FONT_MAP, accent: string) {
  const f    = FONT_MAP[fontKey] ?? FONT_MAP.helvetica;
  const TEXT = "#1a1a2e";
  const MUTED = "#64748b";
  const WHITE = "#ffffff";

  return {
    page: {
      fontFamily: f.reg,
      fontSize: 10,
      color: TEXT,
      backgroundColor: WHITE,
      paddingTop: 46,
      paddingBottom: 46,
      paddingHorizontal: 46,
    },
    // Header
    headerBlock: {
      marginBottom: 4,
    },
    senderName: {
      fontFamily: f.bold,
      fontSize: 20,
      color: TEXT,
      letterSpacing: 0.3,
      marginBottom: 2,
    },
    senderTitle: {
      fontFamily: f.reg,
      fontSize: 10,
      color: accent,
      letterSpacing: 0.4,
      marginBottom: 6,
    },
    contactLine: {
      fontFamily: f.reg,
      fontSize: 8.5,
      color: MUTED,
      lineHeight: 1.6,
    },
    // Date
    dateText: {
      fontFamily: f.reg,
      fontSize: 9,
      color: MUTED,
      marginTop: 10,
      marginBottom: 14,
    },
    // Divider
    divider: {
      height: 2,
      backgroundColor: accent,
      marginTop: 8,
      marginBottom: 14,
    },
    // Recipient block
    recipientBlock: {
      marginBottom: 16,
    },
    recipientName: {
      fontFamily: f.bold,
      fontSize: 10,
      color: TEXT,
      marginBottom: 1,
    },
    recipientCompany: {
      fontFamily: f.reg,
      fontSize: 10,
      color: TEXT,
      marginBottom: 1,
    },
    recipientAddress: {
      fontFamily: f.reg,
      fontSize: 9,
      color: MUTED,
    },
    // Subject line
    subjectLine: {
      fontFamily: f.bold,
      fontSize: 10,
      color: accent,
      marginBottom: 14,
    },
    // Body paragraphs
    paragraph: {
      fontFamily: f.reg,
      fontSize: 10,
      color: TEXT,
      lineHeight: 1.7,
      marginBottom: 12,
    },
    // Sign-off
    signOff: {
      fontFamily: f.reg,
      fontSize: 10,
      color: TEXT,
      lineHeight: 1.7,
      marginTop: 6,
    },
    signerName: {
      fontFamily: f.bold,
      fontSize: 10,
      color: TEXT,
      marginTop: 28,
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Main document ─────────────────────────────────────────────────────────────

export function UserCoverLetterDocument({ data }: { data: CoverLetterFormData }) {
  const fontKey = (data.styles?.fontFamily ?? "helvetica") as keyof typeof FONT_MAP;
  const accent  = data.styles?.accentColor ?? "#6366f1";
  const s       = buildStyles(fontKey, accent);

  const { personal, recipient, jobDetails, letter } = data;

  const contactParts: string[] = [];
  if (personal.email)    contactParts.push(personal.email);
  if (personal.phone)    contactParts.push(personal.phone);
  if (personal.location) contactParts.push(personal.location);

  return (
    <Document
      title={`${personal.fullName || "Cover Letter"} — ${jobDetails.position || "Application"}`}
      author={personal.fullName}
      subject="Cover Letter"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.headerBlock}>
          <Text style={s.senderName}>{personal.fullName || "Your Name"}</Text>
          {personal.jobTitle ? (
            <Text style={s.senderTitle}>{personal.jobTitle}</Text>
          ) : null}
          {contactParts.length > 0 ? (
            <Text style={s.contactLine}>{contactParts.join("  ·  ")}</Text>
          ) : null}
        </View>

        {/* ── DIVIDER ── */}
        <View style={s.divider} />

        {/* ── DATE ── */}
        <Text style={s.dateText}>{formatDate()}</Text>

        {/* ── RECIPIENT BLOCK ── */}
        <View style={s.recipientBlock}>
          {recipient.hiringManager ? (
            <Text style={s.recipientName}>{recipient.hiringManager}</Text>
          ) : null}
          {recipient.company ? (
            <Text style={s.recipientCompany}>{recipient.company}</Text>
          ) : null}
          {recipient.address ? (
            <Text style={s.recipientAddress}>{recipient.address}</Text>
          ) : null}
        </View>

        {/* ── SUBJECT LINE ── */}
        {(jobDetails.position || recipient.company) ? (
          <Text style={s.subjectLine}>
            {`Re: ${jobDetails.position || "Position"}${recipient.company ? ` Position at ${recipient.company}` : " Application"}`}
          </Text>
        ) : null}

        {/* ── BODY PARAGRAPHS ── */}
        {letter.opening ? (
          <Text style={s.paragraph}>{letter.opening}</Text>
        ) : null}

        {letter.bodyParagraph1 ? (
          <Text style={s.paragraph}>{letter.bodyParagraph1}</Text>
        ) : null}

        {letter.bodyParagraph2 ? (
          <Text style={s.paragraph}>{letter.bodyParagraph2}</Text>
        ) : null}

        {letter.bodyParagraph3 ? (
          <Text style={s.paragraph}>{letter.bodyParagraph3}</Text>
        ) : null}

        {letter.closing ? (
          <Text style={s.paragraph}>{letter.closing}</Text>
        ) : null}

        {/* ── SIGN-OFF ── */}
        <Text style={s.signOff}>Yours sincerely,</Text>
        <Text style={s.signerName}>{personal.fullName || "Your Name"}</Text>

      </Page>
    </Document>
  );
}
