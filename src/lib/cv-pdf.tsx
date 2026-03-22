import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type {
  Profile,
  Experience,
  Education,
  Skill,
  Project,
  ContactInfo,
  Achievement,
} from "@/types/database";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(d: string | null | undefined) {
  if (!d) return "Present";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const C = {
  primary: "#6366f1",   // indigo
  text: "#111827",
  muted: "#6b7280",
  light: "#f3f4f6",
  border: "#e5e7eb",
  white: "#ffffff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.text,
    backgroundColor: C.white,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 42,
  },

  // ── Header ──
  header: { marginBottom: 16 },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  title: {
    fontSize: 11,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  contactItem: { fontSize: 8, color: C.muted, flexDirection: "row", gap: 3 },
  contactLink: { fontSize: 8, color: C.primary, textDecoration: "none" },
  divider: {
    height: 1.5,
    backgroundColor: C.primary,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 1,
  },

  // ── Two-column layout ──
  body: { flexDirection: "row", gap: 20 },
  mainCol: { flex: 1.6 },
  sideCol: { flex: 1 },

  // ── Section ──
  section: { marginBottom: 14 },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: "solid",
  },

  // ── Entry (experience / education) ──
  entry: { marginBottom: 10 },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    flex: 1,
  },
  entryDate: {
    fontSize: 7.5,
    color: C.muted,
    fontFamily: "Helvetica-Oblique",
    whiteSpace: "nowrap",
  },
  entryCompany: {
    fontSize: 8.5,
    color: C.primary,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
  entryBody: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.55,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 8,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
  },

  // ── Skills ──
  skillCategory: { marginBottom: 7 },
  skillCatLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  skillPills: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  pill: {
    backgroundColor: C.light,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7.5,
    color: C.text,
  },

  // ── Projects ──
  project: { marginBottom: 8 },
  projectTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    marginBottom: 2,
  },
  projectStack: { fontSize: 7.5, color: C.primary, marginBottom: 2 },
  projectDesc: { fontSize: 8, color: "#374151", lineHeight: 1.5 },

  // ── Achievements sidebar ──
  achievement: { marginBottom: 6 },
  achieveTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.text, marginBottom: 1 },
  achieveIssuer: { fontSize: 7.5, color: C.muted },

  // ── Summary ──
  summary: { fontSize: 8.5, color: "#374151", lineHeight: 1.6, marginBottom: 14 },
});

// ─── Bullet helper ────────────────────────────────────────────────────────────

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>{text.trim()}</Text>
    </View>
  );
}

function parseBullets(raw: string): string[] {
  const clean = stripHtml(raw);
  const lines = clean
    .split(/\n|•|-{1,2}(?=\s)/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

// ─── CV Document ─────────────────────────────────────────────────────────────

interface CVProps {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  contact: ContactInfo | null;
  achievements: Achievement[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export function CVDocument({
  profile,
  experiences,
  education,
  skills,
  projects,
  contact,
  achievements,
  githubUrl,
  linkedinUrl,
  portfolioUrl = "ravishanmga.vercel.app",
}: CVProps) {
  // Group skills
  const skillGroups = skills.reduce<Record<string, Skill[]>>((acc, sk) => {
    const cat = sk.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sk);
    return acc;
  }, {});

  const topProjects = projects.slice(0, 4);

  return (
    <Document
      title={`${profile.name ?? "CV"} - Resume`}
      author={profile.name ?? ""}
      subject="Resume / CV"
      keywords={`${profile.title ?? ""}, ${skills.map((s) => s.name).join(", ")}`}
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{profile.name ?? "Name"}</Text>
          <Text style={s.title}>{profile.title ?? ""}</Text>

          <View style={s.contactRow}>
            {contact?.email && (
              <View style={s.contactItem}>
                <Text>✉</Text>
                <Link src={`mailto:${contact.email}`} style={s.contactLink}>{contact.email}</Link>
              </View>
            )}
            {contact?.phone && (
              <View style={s.contactItem}>
                <Text>✆ {contact.phone}</Text>
              </View>
            )}
            {contact?.location && (
              <View style={s.contactItem}>
                <Text>⌖ {contact.location}</Text>
              </View>
            )}
            {linkedinUrl && (
              <View style={s.contactItem}>
                <Link src={linkedinUrl} style={s.contactLink}>{linkedinUrl.replace("https://", "")}</Link>
              </View>
            )}
            {githubUrl && (
              <View style={s.contactItem}>
                <Link src={githubUrl} style={s.contactLink}>{githubUrl.replace("https://", "")}</Link>
              </View>
            )}
            {portfolioUrl && (
              <View style={s.contactItem}>
                <Link src={`https://${portfolioUrl}`} style={s.contactLink}>{portfolioUrl}</Link>
              </View>
            )}
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Professional Summary ── */}
        {profile.bio && (
          <Text style={s.summary}>
            {stripHtml(profile.bio).replace(/\n\n/g, " ").slice(0, 600)}
          </Text>
        )}

        {/* ── Two-column body ── */}
        <View style={s.body}>
          {/* ── Main column ── */}
          <View style={s.mainCol}>
            {/* Experience */}
            {experiences.length > 0 && (
              <Section label="Work Experience">
                {experiences.map((exp) => (
                  <View key={exp.id} style={s.entry}>
                    <View style={s.entryHeader}>
                      <Text style={s.entryTitle}>{exp.position}</Text>
                      <Text style={s.entryDate}>
                        {fmtDate(exp.start_date)} – {exp.is_current ? "Present" : fmtDate(exp.end_date)}
                      </Text>
                    </View>
                    <Text style={s.entryCompany}>{exp.company}</Text>
                    {exp.description && parseBullets(exp.description).map((b, i) => (
                      <Bullet key={i} text={b} />
                    ))}
                  </View>
                ))}
              </Section>
            )}

            {/* Featured Projects */}
            {topProjects.length > 0 && (
              <Section label="Key Projects">
                {topProjects.map((p) => (
                  <View key={p.id} style={s.project}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={s.projectTitle}>{p.title}</Text>
                      {p.live_url && (
                        <Link src={p.live_url} style={s.contactLink}>{p.live_url.replace("https://", "")}</Link>
                      )}
                    </View>
                    {p.tech_stack && p.tech_stack.length > 0 && (
                      <Text style={s.projectStack}>{p.tech_stack.join(" · ")}</Text>
                    )}
                    {p.short_description && (
                      <Text style={s.projectDesc}>{stripHtml(p.short_description)}</Text>
                    )}
                  </View>
                ))}
              </Section>
            )}
          </View>

          {/* ── Side column ── */}
          <View style={s.sideCol}>
            {/* Education */}
            {education.length > 0 && (
              <Section label="Education">
                {education.map((edu) => (
                  <View key={edu.id} style={s.entry}>
                    <Text style={s.entryTitle}>{edu.degree}</Text>
                    {edu.field_of_study && (
                      <Text style={{ ...s.entryBody, marginBottom: 1 }}>{edu.field_of_study}</Text>
                    )}
                    <Text style={s.entryCompany}>{edu.institution}</Text>
                    <Text style={s.entryDate}>
                      {fmtDate(edu.start_date)} – {edu.is_current ? "Present" : fmtDate(edu.end_date)}
                    </Text>
                    {edu.grade && (
                      <Text style={{ ...s.entryBody, marginTop: 2 }}>Grade: {edu.grade}</Text>
                    )}
                  </View>
                ))}
              </Section>
            )}

            {/* Skills */}
            {Object.keys(skillGroups).length > 0 && (
              <Section label="Technical Skills">
                {Object.entries(skillGroups).map(([cat, catSkills]) => (
                  <View key={cat} style={s.skillCategory}>
                    <Text style={s.skillCatLabel}>{cat}</Text>
                    <View style={s.skillPills}>
                      {catSkills.map((sk) => (
                        <Text key={sk.id} style={s.pill}>{sk.name}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </Section>
            )}

            {/* Certifications & Achievements */}
            {achievements.length > 0 && (
              <Section label="Certifications & Awards">
                {achievements.slice(0, 8).map((a) => (
                  <View key={a.id} style={s.achievement}>
                    <Text style={s.achieveTitle}>{a.title}</Text>
                    {a.issuer && <Text style={s.achieveIssuer}>{a.issuer}{a.issue_date ? ` · ${fmtDate(a.issue_date)}` : ""}</Text>}
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
