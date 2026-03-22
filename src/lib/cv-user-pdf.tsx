import { Document, Page, Text, View, Link } from "@react-pdf/renderer";
import type { CVFormData } from "@/types/database";

// ── Date helper ───────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function parseBullets(raw: string): string[] {
  return raw.split(/\n|•|-{1,2}(?=\s)/).map((l) => l.trim()).filter(Boolean);
}

// ── Font maps (built-in PDF fonts) ───────────────────────────────────────────

const FONT_MAP = {
  helvetica: { reg: "Helvetica",   bold: "Helvetica-Bold",  italic: "Helvetica-Oblique" },
  times:     { reg: "Times-Roman", bold: "Times-Bold",      italic: "Times-Italic"      },
  courier:   { reg: "Courier",     bold: "Courier-Bold",    italic: "Courier-Oblique"   },
} as const;

// ── Style builder (creates all styles from font + accent color) ───────────────

function buildStyles(fontKey: keyof typeof FONT_MAP, accent: string) {
  const f = FONT_MAP[fontKey] ?? FONT_MAP.helvetica;
  const TEXT  = "#1a1a2e";
  const MUTED = "#64748b";
  const LIGHT = "#f8fafc";
  const BORDER= "#e2e8f0";
  const WHITE = "#ffffff";

  return {
    page: {
      fontFamily: f.reg,
      fontSize: 9,
      color: TEXT,
      backgroundColor: WHITE,
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 46,
    },

    // ── Header ─────────────────────────────────────────────────────────────
    headerBlock: {
      marginBottom: 10,
    },
    name: {
      fontFamily: f.bold,
      fontSize: 26,
      color: TEXT,
      letterSpacing: 0.3,
      marginBottom: 3,
    },
    jobTitle: {
      fontFamily: f.reg,
      fontSize: 11,
      color: accent,
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      alignItems: "center" as const,
      gap: 0,
    },
    contactSep: {
      fontSize: 7,
      color: MUTED,
      paddingHorizontal: 5,
    },
    contactItem: {
      fontSize: 7.5,
      color: MUTED,
      fontFamily: f.reg,
    },
    contactLink: {
      fontSize: 7.5,
      color: accent,
      textDecoration: "none" as const,
      fontFamily: f.reg,
    },

    // ── Divider ────────────────────────────────────────────────────────────
    divider: {
      height: 2,
      backgroundColor: accent,
      marginTop: 10,
      marginBottom: 14,
    },
    dividerThin: {
      height: 0.5,
      backgroundColor: BORDER,
      marginTop: 10,
      marginBottom: 14,
    },

    // ── Two-column body ────────────────────────────────────────────────────
    body: {
      flexDirection: "row" as const,
      gap: 22,
    },
    mainCol: { flex: 1.65 },
    sideCol: { flex: 1 },

    // ── Section ────────────────────────────────────────────────────────────
    section: { marginBottom: 14 },
    sectionLabel: {
      fontFamily: f.bold,
      fontSize: 7,
      color: accent,
      textTransform: "uppercase" as const,
      letterSpacing: 1.5,
      marginBottom: 7,
      paddingBottom: 4,
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
      borderBottomStyle: "solid" as const,
    },

    // ── Entry (exp / edu) ──────────────────────────────────────────────────
    entry: { marginBottom: 10 },
    entryHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: 1,
    },
    entryTitle: {
      fontFamily: f.bold,
      fontSize: 9.5,
      color: TEXT,
      flex: 1,
    },
    entryDate: {
      fontFamily: f.italic,
      fontSize: 7.5,
      color: MUTED,
    },
    entryOrg: {
      fontFamily: f.bold,
      fontSize: 8.5,
      color: accent,
      marginBottom: 3,
    },
    entryOrgSub: {
      fontFamily: f.italic,
      fontSize: 7.5,
      color: MUTED,
      marginBottom: 1,
    },

    // ── Bullets ────────────────────────────────────────────────────────────
    bullet: {
      flexDirection: "row" as const,
      marginBottom: 2.5,
      paddingLeft: 6,
    },
    bulletDot: {
      fontFamily: f.bold,
      fontSize: 8.5,
      color: accent,
      width: 10,
      marginTop: 0.5,
    },
    bulletText: {
      flex: 1,
      fontFamily: f.reg,
      fontSize: 8,
      color: "#334155",
      lineHeight: 1.55,
    },

    // ── Summary ────────────────────────────────────────────────────────────
    summary: {
      fontFamily: f.reg,
      fontSize: 8.5,
      color: "#374151",
      lineHeight: 1.7,
      marginBottom: 14,
    },

    // ── Skills ─────────────────────────────────────────────────────────────
    skillGroup: { marginBottom: 6 },
    skillCatLabel: {
      fontFamily: f.bold,
      fontSize: 7.5,
      color: TEXT,
      marginBottom: 2,
    },
    skillText: {
      fontFamily: f.reg,
      fontSize: 8,
      color: "#374151",
      lineHeight: 1.5,
    },

    // ── Project ────────────────────────────────────────────────────────────
    projectEntry: { marginBottom: 9 },
    projectHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "baseline" as const,
      marginBottom: 1,
    },
    projectTitle: {
      fontFamily: f.bold,
      fontSize: 9,
      color: TEXT,
    },
    projectLink: {
      fontFamily: f.italic,
      fontSize: 7,
      color: accent,
      textDecoration: "none" as const,
    },
    projectStack: {
      fontFamily: f.italic,
      fontSize: 7.5,
      color: accent,
      marginBottom: 2,
    },
    projectDesc: {
      fontFamily: f.reg,
      fontSize: 8,
      color: "#374151",
      lineHeight: 1.5,
    },

    // ── Cert ───────────────────────────────────────────────────────────────
    certTitle: {
      fontFamily: f.bold,
      fontSize: 8,
      color: TEXT,
      marginBottom: 1,
    },
    certSub: {
      fontFamily: f.reg,
      fontSize: 7.5,
      color: MUTED,
    },
    certEntry: { marginBottom: 6 },

    // ── Sidebar callout box ────────────────────────────────────────────────
    accentBox: {
      backgroundColor: LIGHT,
      borderLeftWidth: 2,
      borderLeftColor: accent,
      borderLeftStyle: "solid" as const,
      paddingLeft: 6,
      paddingVertical: 3,
      marginBottom: 4,
    },
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

type S = ReturnType<typeof buildStyles>;

function Section({ s, label, children }: { s: S; label: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Bullet({ s, text }: { s: S; text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>▸</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

function ContactSep({ s }: { s: S }) {
  return <Text style={s.contactSep}>|</Text>;
}

// ── Main document ─────────────────────────────────────────────────────────────

export function UserCVDocument({ data }: { data: CVFormData }) {
  const fontKey = (data.styles?.fontFamily ?? "helvetica") as keyof typeof FONT_MAP;
  const accent  = data.styles?.accentColor ?? "#6366f1";
  const s       = buildStyles(fontKey, accent);

  const { personal, summary, experience, education, skills, projects, certifications } = data;

  const hasExp   = experience.some((e) => e.company);
  const hasProj  = projects.some((p) => p.name);
  const hasEdu   = education.some((e) => e.institution);
  const hasSkill = skills.some((g) => g.category && g.items);
  const hasCert  = certifications.some((c) => c.name);

  // Build contact items with separators
  const contacts: { type: "text" | "link"; value: string; href?: string }[] = [];
  if (personal.email)    contacts.push({ type: "text", value: `✉  ${personal.email}` });
  if (personal.phone)    contacts.push({ type: "text", value: `✆  ${personal.phone}` });
  if (personal.location) contacts.push({ type: "text", value: `⌖  ${personal.location}` });
  if (personal.linkedin) contacts.push({ type: "link", value: personal.linkedin.replace("https://www.", "").replace("https://", ""), href: personal.linkedin });
  if (personal.github)   contacts.push({ type: "link", value: personal.github.replace("https://", ""), href: personal.github });
  if (personal.website)  contacts.push({ type: "link", value: personal.website.replace("https://", ""), href: personal.website });

  return (
    <Document
      title={`${personal.fullName} - Resume`}
      author={personal.fullName}
      subject="Resume / CV"
      keywords={`${personal.jobTitle}, ${skills.flatMap((g) => g.items.split(",")).join(", ")}`}
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.headerBlock}>
          <Text style={s.name}>{personal.fullName || "Your Name"}</Text>
          <Text style={s.jobTitle}>{personal.jobTitle}</Text>

          {/* Contact row with pipe separators */}
          <View style={s.contactRow}>
            {contacts.map((c, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                {i > 0 && <ContactSep s={s} />}
                {c.type === "link" && c.href ? (
                  <Link src={c.href} style={s.contactLink}>{c.value}</Link>
                ) : (
                  <Text style={s.contactItem}>{c.value}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ── ACCENT DIVIDER ── */}
        <View style={s.divider} />

        {/* ── PROFESSIONAL SUMMARY ── */}
        {summary && (
          <Text style={s.summary}>{summary}</Text>
        )}

        {/* ── TWO-COLUMN BODY ── */}
        <View style={s.body}>

          {/* ── MAIN COLUMN ── */}
          <View style={s.mainCol}>

            {/* Work Experience */}
            {hasExp && (
              <Section s={s} label="Work Experience">
                {experience.filter((e) => e.company).map((exp) => (
                  <View key={exp.id} style={s.entry}>
                    <View style={s.entryHeader}>
                      <Text style={s.entryTitle}>{exp.position}</Text>
                      <Text style={s.entryDate}>
                        {fmtDate(exp.startDate)}{exp.startDate ? " – " : ""}
                        {exp.isCurrent ? "Present" : fmtDate(exp.endDate)}
                      </Text>
                    </View>
                    <Text style={s.entryOrg}>{exp.company}</Text>
                    {exp.description &&
                      parseBullets(exp.description).map((b, i) => (
                        <Bullet key={i} s={s} text={b} />
                      ))}
                  </View>
                ))}
              </Section>
            )}

            {/* Projects */}
            {hasProj && (
              <Section s={s} label="Projects">
                {projects.filter((p) => p.name).map((p) => (
                  <View key={p.id} style={s.projectEntry}>
                    <View style={s.projectHeader}>
                      <Text style={s.projectTitle}>{p.name}</Text>
                      {p.url && (
                        <Link src={p.url} style={s.projectLink}>
                          {p.url.replace("https://", "")}
                        </Link>
                      )}
                    </View>
                    {p.techStack && <Text style={s.projectStack}>{p.techStack}</Text>}
                    {p.description && <Text style={s.projectDesc}>{p.description}</Text>}
                  </View>
                ))}
              </Section>
            )}
          </View>

          {/* ── SIDE COLUMN ── */}
          <View style={s.sideCol}>

            {/* Education */}
            {hasEdu && (
              <Section s={s} label="Education">
                {education.filter((e) => e.institution).map((edu) => (
                  <View key={edu.id} style={s.entry}>
                    <Text style={s.entryTitle}>{edu.degree}</Text>
                    {edu.fieldOfStudy && (
                      <Text style={s.entryOrgSub}>{edu.fieldOfStudy}</Text>
                    )}
                    <Text style={s.entryOrg}>{edu.institution}</Text>
                    <Text style={s.entryDate}>
                      {fmtDate(edu.startDate)}{edu.startDate ? " – " : ""}
                      {edu.isCurrent ? "Present" : fmtDate(edu.endDate)}
                    </Text>
                    {edu.grade && (
                      <View style={{ ...s.accentBox, marginTop: 3 }}>
                        <Text style={{ fontSize: 7.5, fontFamily: FONT_MAP[fontKey].bold, color: accent }}>
                          {edu.grade}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </Section>
            )}

            {/* Skills */}
            {hasSkill && (
              <Section s={s} label="Technical Skills">
                {skills.filter((g) => g.category && g.items).map((group) => (
                  <View key={group.id} style={s.skillGroup}>
                    <Text style={s.skillCatLabel}>{group.category}</Text>
                    <Text style={s.skillText}>
                      {group.items.split(",").map((sk) => sk.trim()).filter(Boolean).join("  ·  ")}
                    </Text>
                  </View>
                ))}
              </Section>
            )}

            {/* Certifications */}
            {hasCert && (
              <Section s={s} label="Certifications & Awards">
                {certifications.filter((c) => c.name).map((cert) => (
                  <View key={cert.id} style={s.certEntry}>
                    {cert.url ? (
                      <Link src={cert.url} style={{ ...s.certTitle, textDecoration: "none" }}>
                        {cert.name}
                      </Link>
                    ) : (
                      <Text style={s.certTitle}>{cert.name}</Text>
                    )}
                    <Text style={s.certSub}>
                      {cert.issuer}{cert.date ? `  ·  ${fmtDate(cert.date)}` : ""}
                    </Text>
                  </View>
                ))}
              </Section>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
