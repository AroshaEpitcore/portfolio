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

function buildStyles(
  fontKey: keyof typeof FONT_MAP,
  accent: string,
  headerAlign: "left" | "center" = "left",
  spacing: "compact" | "normal" | "spacious" = "normal"
) {
  const f = FONT_MAP[fontKey] ?? FONT_MAP.helvetica;
  const TEXT  = "#1a1a2e";
  const MUTED = "#64748b";
  const LIGHT = "#f8fafc";
  const BORDER= "#e2e8f0";
  const WHITE = "#ffffff";

  const SP = spacing === "compact" ? 0.72 : spacing === "spacious" ? 1.28 : 1.0;
  const ALIGN = headerAlign === "center" ? "center" as const : "flex-start" as const;
  const TALIGN = headerAlign === "center" ? "center" as const : "left" as const;

  return {
    page: {
      fontFamily: f.reg,
      fontSize: 9,
      color: TEXT,
      backgroundColor: WHITE,
      paddingTop: Math.round(40 * SP),
      paddingBottom: Math.round(40 * SP),
      paddingHorizontal: Math.round(46 * SP),
    },

    // ── Header ─────────────────────────────────────────────────────────────
    headerBlock: {
      marginBottom: Math.round(10 * SP),
      alignItems: ALIGN,
    },
    name: {
      fontFamily: f.bold,
      fontSize: 26,
      color: TEXT,
      letterSpacing: 0.3,
      marginBottom: 3,
      textAlign: TALIGN,
    },
    jobTitle: {
      fontFamily: f.reg,
      fontSize: 11,
      color: accent,
      letterSpacing: 0.5,
      marginBottom: 8,
      textAlign: TALIGN,
    },
    contactRow: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      alignItems: "center" as const,
      justifyContent: headerAlign === "center" ? "center" as const : "flex-start" as const,
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
      marginTop: Math.round(10 * SP),
      marginBottom: Math.round(14 * SP),
    },
    dividerThin: {
      height: 0.5,
      backgroundColor: BORDER,
      marginTop: Math.round(10 * SP),
      marginBottom: Math.round(14 * SP),
    },

    // ── Two-column body ────────────────────────────────────────────────────
    body: {
      flexDirection: "row" as const,
      gap: Math.round(22 * SP),
    },
    mainCol: { flex: 1.65 },
    sideCol: { flex: 1 },

    // ── Section ────────────────────────────────────────────────────────────
    section: { marginBottom: Math.round(14 * SP) },
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
    entry: { marginBottom: Math.round(10 * SP) },
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
    // Education title — same as entryTitle but NO flex:1 so it doesn't collapse siblings
    eduTitle: {
      fontFamily: f.bold,
      fontSize: 9,
      color: TEXT,
      marginBottom: 2,
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

    // ── Language ───────────────────────────────────────────────────────────
    langRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 4,
    },
    langName: {
      fontFamily: f.reg,
      fontSize: 8,
      color: TEXT,
    },
    langProf: {
      fontFamily: f.italic,
      fontSize: 7,
      color: MUTED,
    },

    // ── Reference ──────────────────────────────────────────────────────────
    refEntry: { marginBottom: 7 },
    refName: {
      fontFamily: f.bold,
      fontSize: 8,
      color: TEXT,
      marginBottom: 1,
    },
    refSub: {
      fontFamily: f.reg,
      fontSize: 7.5,
      color: MUTED,
    },

    // ── Custom section content ─────────────────────────────────────────────
    customContent: {
      fontFamily: f.reg,
      fontSize: 8.5,
      color: "#374151",
      lineHeight: 1.6,
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

const MAIN_SECTIONS = ["experience", "projects", "volunteer", "customSections", "references"];
const SIDE_SECTIONS = ["education", "skills", "certifications", "languages"];
const DEFAULT_SECTION_ORDER = [...MAIN_SECTIONS, ...SIDE_SECTIONS];

export function UserCVDocument({ data }: { data: CVFormData }) {
  const fontKey     = (data.styles?.fontFamily ?? "helvetica") as keyof typeof FONT_MAP;
  const accent      = data.styles?.accentColor ?? "#6366f1";
  const headerAlign = data.styles?.headerAlign ?? "left";
  const spacing     = data.styles?.spacing ?? "normal";
  const s           = buildStyles(fontKey, accent, headerAlign, spacing);

  // Determine ordered main + side section keys based on user preference
  const userOrder = data.styles?.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const orderedMain = [
    ...MAIN_SECTIONS.filter(k => userOrder.includes(k)).sort((a, b) => userOrder.indexOf(a) - userOrder.indexOf(b)),
    ...MAIN_SECTIONS.filter(k => !userOrder.includes(k)),
  ];
  const orderedSide = [
    ...SIDE_SECTIONS.filter(k => userOrder.includes(k)).sort((a, b) => userOrder.indexOf(a) - userOrder.indexOf(b)),
    ...SIDE_SECTIONS.filter(k => !userOrder.includes(k)),
  ];

  const { personal, summary, experience, education, skills, projects, certifications } = data;
  const languages     = data.languages     ?? [];
  const volunteer     = data.volunteer     ?? [];
  const references    = data.references    ?? [];
  const customSections= data.customSections?? [];

  const hasExp   = experience.some((e) => e.company);
  const hasProj  = projects.some((p) => p.name);
  const hasEdu   = education.some((e) => e.institution);
  const hasSkill = skills.some((g) => g.category && g.items);
  const hasCert  = certifications.some((c) => c.name);
  const hasLang  = languages.some((l) => l.language);
  const hasVol   = volunteer.some((v) => v.organization);
  const hasRef   = references.some((r) => r.available || r.name);
  const allRefAvailable = hasRef && references.filter((r) => r.available || r.name).every((r) => r.available);

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

        {/* ── TWO-COLUMN BODY (ordered by user preference) ── */}
        {(() => {
          const mainSectionNodes: Record<string, React.ReactNode> = {
            experience: hasExp ? (
              <Section s={s} label="Work Experience" key="experience">
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
                    {exp.description && parseBullets(exp.description).map((b, i) => <Bullet key={i} s={s} text={b} />)}
                  </View>
                ))}
              </Section>
            ) : null,
            projects: hasProj ? (
              <Section s={s} label="Projects" key="projects">
                {projects.filter((p) => p.name).map((p) => (
                  <View key={p.id} style={s.projectEntry}>
                    <View style={s.projectHeader}>
                      <Text style={s.projectTitle}>{p.name}</Text>
                      {p.url && <Link src={p.url} style={s.projectLink}>{p.url.replace("https://", "")}</Link>}
                    </View>
                    {p.techStack && <Text style={s.projectStack}>{p.techStack}</Text>}
                    {p.description && <Text style={s.projectDesc}>{p.description}</Text>}
                  </View>
                ))}
              </Section>
            ) : null,
            volunteer: hasVol ? (
              <Section s={s} label="Volunteer & Extra-Curricular" key="volunteer">
                {volunteer.filter((v) => v.organization).map((vol) => (
                  <View key={vol.id} style={s.entry}>
                    <View style={s.entryHeader}>
                      <Text style={s.entryTitle}>{vol.role}</Text>
                      <Text style={s.entryDate}>
                        {fmtDate(vol.startDate)}{vol.startDate ? " – " : ""}
                        {vol.isCurrent ? "Present" : fmtDate(vol.endDate)}
                      </Text>
                    </View>
                    <Text style={s.entryOrg}>{vol.organization}</Text>
                    {vol.description && parseBullets(vol.description).map((b, i) => <Bullet key={i} s={s} text={b} />)}
                  </View>
                ))}
              </Section>
            ) : null,
            customSections: customSections.filter((cs) => cs.title && cs.content).length > 0 ? (
              <View key="customSections">
                {customSections.filter((cs) => cs.title && cs.content).map((cs) => (
                  <Section key={cs.id} s={s} label={cs.title}>
                    <Text style={s.customContent}>{cs.content}</Text>
                  </Section>
                ))}
              </View>
            ) : null,
            references: hasRef && !allRefAvailable ? (
              <Section s={s} label="References" key="references">
                {references.filter((r) => r.available || r.name).map((ref) => (
                  <View key={ref.id} style={s.refEntry}>
                    {ref.available ? (
                      <Text style={s.refSub}>Available upon request</Text>
                    ) : (
                      <>
                        <Text style={s.refName}>{ref.name}</Text>
                        <Text style={s.refSub}>{ref.company}{ref.contact ? `  ·  ${ref.contact}` : ""}</Text>
                      </>
                    )}
                  </View>
                ))}
              </Section>
            ) : null,
          };

          const sideSectionNodes: Record<string, React.ReactNode> = {
            education: hasEdu ? (
              <Section s={s} label="Education" key="education">
                {education.filter((e) => e.institution).map((edu) => (
                  <View key={edu.id} style={s.entry}>
                    <Text style={s.eduTitle}>{edu.fieldOfStudy ? `${edu.degree} — ${edu.fieldOfStudy}` : edu.degree}</Text>
                    <Text style={s.entryOrg}>{edu.institution}</Text>
                    <Text style={s.entryDate}>
                      {fmtDate(edu.startDate)}{edu.startDate ? " – " : ""}
                      {edu.isCurrent ? "Present" : fmtDate(edu.endDate)}
                    </Text>
                    {edu.grade && (
                      <View style={{ ...s.accentBox, marginTop: 3 }}>
                        <Text style={{ fontSize: 7.5, fontFamily: FONT_MAP[fontKey].bold, color: accent }}>{edu.grade}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </Section>
            ) : null,
            skills: hasSkill ? (
              <Section s={s} label="Technical Skills" key="skills">
                {skills.filter((g) => g.category && g.items).map((group) => (
                  <View key={group.id} style={s.skillGroup}>
                    <Text style={s.skillCatLabel}>{group.category}</Text>
                    <Text style={s.skillText}>{group.items.split(",").map((sk) => sk.trim()).filter(Boolean).join("  ·  ")}</Text>
                  </View>
                ))}
              </Section>
            ) : null,
            certifications: hasCert ? (
              <Section s={s} label="Certifications & Awards" key="certifications">
                {certifications.filter((c) => c.name).map((cert) => (
                  <View key={cert.id} style={s.certEntry}>
                    {cert.url ? (
                      <Link src={cert.url} style={{ ...s.certTitle, textDecoration: "none" as const }}>
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
            ) : null,
            languages: hasLang ? (
              <Section s={s} label="Languages" key="languages">
                {languages.filter((l) => l.language).map((lang) => (
                  <View key={lang.id} style={s.langRow}>
                    <Text style={s.langName}>{lang.language}</Text>
                    <Text style={s.langProf}>{lang.proficiency}</Text>
                  </View>
                ))}
              </Section>
            ) : null,
          };

          return (
            <View style={s.body}>
              <View style={s.mainCol}>
                {orderedMain.map((key) => mainSectionNodes[key] ?? null)}
              </View>
              <View style={s.sideCol}>
                {orderedSide.map((key) => sideSectionNodes[key] ?? null)}
                {/* References available-on-request always goes at the bottom of the sidebar */}
                {hasRef && allRefAvailable && (
                  <Section s={s} label="References">
                    <Text style={s.refSub}>Available upon request</Text>
                  </Section>
                )}
              </View>
            </View>
          );
        })()}

      </Page>
    </Document>
  );
}
