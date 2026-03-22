import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { CVFormData } from "@/types/database";

function fmtDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

const C = {
  primary: "#6366f1",
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
    paddingHorizontal: 44,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 3,
  },
  contactItem: {
    fontSize: 7.5,
    color: C.muted,
  },
  contactLink: {
    fontSize: 7.5,
    color: C.primary,
    textDecoration: "none",
  },
  divider: {
    height: 1.5,
    backgroundColor: C.primary,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 1,
  },
  body: {
    flexDirection: "row",
    gap: 18,
  },
  mainCol: {
    flex: 1.6,
  },
  sideCol: {
    flex: 1,
  },
  section: {
    marginBottom: 13,
  },
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
  entry: {
    marginBottom: 9,
  },
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
  },
  entryOrg: {
    fontSize: 8.5,
    color: C.primary,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
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
  summary: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 13,
  },
  skillGroup: {
    marginBottom: 7,
  },
  skillCat: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  skillPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  pill: {
    backgroundColor: C.light,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7.5,
    color: C.text,
  },
  projectTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.text,
    marginBottom: 1,
  },
  projectStack: {
    fontSize: 7.5,
    color: C.primary,
    marginBottom: 2,
  },
  projectDesc: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
  },
});

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>{text.trim()}</Text>
    </View>
  );
}

function parseBullets(raw: string): string[] {
  return raw
    .split(/\n|•/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function UserCVDocument({ data }: { data: CVFormData }) {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  return (
    <Document
      title={`${personal.fullName} - CV`}
      author={personal.fullName}
      subject="Resume / CV"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{personal.fullName}</Text>
        <Text style={s.jobTitle}>{personal.jobTitle}</Text>
        <View style={s.contactRow}>
          {personal.email && (
            <Text style={s.contactItem}>✉ {personal.email}</Text>
          )}
          {personal.phone && (
            <Text style={s.contactItem}>✆ {personal.phone}</Text>
          )}
          {personal.location && (
            <Text style={s.contactItem}>⌖ {personal.location}</Text>
          )}
          {personal.linkedin && (
            <Link src={personal.linkedin} style={s.contactLink}>
              {personal.linkedin.replace("https://", "")}
            </Link>
          )}
          {personal.github && (
            <Link src={personal.github} style={s.contactLink}>
              {personal.github.replace("https://", "")}
            </Link>
          )}
          {personal.website && (
            <Link src={personal.website} style={s.contactLink}>
              {personal.website.replace("https://", "")}
            </Link>
          )}
        </View>
        <View style={s.divider} />

        {/* Summary */}
        {summary && <Text style={s.summary}>{summary}</Text>}

        <View style={s.body}>
          {/* Main col */}
          <View style={s.mainCol}>
            {/* Experience */}
            {experience.filter((e) => e.company).length > 0 && (
              <Section label="Work Experience">
                {experience
                  .filter((e) => e.company)
                  .map((exp) => (
                    <View key={exp.id} style={s.entry}>
                      <View style={s.entryHeader}>
                        <Text style={s.entryTitle}>{exp.position}</Text>
                        <Text style={s.entryDate}>
                          {fmtDate(exp.startDate)} –{" "}
                          {exp.isCurrent ? "Present" : fmtDate(exp.endDate)}
                        </Text>
                      </View>
                      <Text style={s.entryOrg}>{exp.company}</Text>
                      {exp.description &&
                        parseBullets(exp.description).map((b, i) => (
                          <Bullet key={i} text={b} />
                        ))}
                    </View>
                  ))}
              </Section>
            )}

            {/* Projects */}
            {projects.filter((p) => p.name).length > 0 && (
              <Section label="Projects">
                {projects
                  .filter((p) => p.name)
                  .map((p) => (
                    <View key={p.id} style={s.entry}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={s.projectTitle}>{p.name}</Text>
                        {p.url && (
                          <Link src={p.url} style={s.contactLink}>
                            {p.url.replace("https://", "")}
                          </Link>
                        )}
                      </View>
                      {p.techStack && (
                        <Text style={s.projectStack}>{p.techStack}</Text>
                      )}
                      {p.description && (
                        <Text style={s.projectDesc}>{p.description}</Text>
                      )}
                    </View>
                  ))}
              </Section>
            )}
          </View>

          {/* Side col */}
          <View style={s.sideCol}>
            {/* Education */}
            {education.filter((e) => e.institution).length > 0 && (
              <Section label="Education">
                {education
                  .filter((e) => e.institution)
                  .map((edu) => (
                    <View key={edu.id} style={s.entry}>
                      <Text style={s.entryTitle}>{edu.degree}</Text>
                      {edu.fieldOfStudy && (
                        <Text
                          style={{
                            fontSize: 8,
                            color: C.muted,
                            marginBottom: 1,
                          }}
                        >
                          {edu.fieldOfStudy}
                        </Text>
                      )}
                      <Text style={s.entryOrg}>{edu.institution}</Text>
                      <Text style={s.entryDate}>
                        {fmtDate(edu.startDate)} –{" "}
                        {edu.isCurrent ? "Present" : fmtDate(edu.endDate)}
                      </Text>
                      {edu.grade && (
                        <Text
                          style={{ fontSize: 8, color: C.muted, marginTop: 2 }}
                        >
                          Grade: {edu.grade}
                        </Text>
                      )}
                    </View>
                  ))}
              </Section>
            )}

            {/* Skills */}
            {skills.filter((g) => g.category && g.items).length > 0 && (
              <Section label="Skills">
                {skills
                  .filter((g) => g.category && g.items)
                  .map((group) => (
                    <View key={group.id} style={s.skillGroup}>
                      <Text style={s.skillCat}>{group.category}</Text>
                      <View style={s.skillPills}>
                        {group.items
                          .split(",")
                          .map((sk) => sk.trim())
                          .filter(Boolean)
                          .map((sk, i) => (
                            <Text key={i} style={s.pill}>
                              {sk}
                            </Text>
                          ))}
                      </View>
                    </View>
                  ))}
              </Section>
            )}

            {/* Certifications */}
            {certifications.filter((c) => c.name).length > 0 && (
              <Section label="Certifications">
                {certifications
                  .filter((c) => c.name)
                  .map((cert) => (
                    <View key={cert.id} style={s.entry}>
                      <Text
                        style={{
                          fontSize: 8,
                          fontFamily: "Helvetica-Bold",
                          color: C.text,
                        }}
                      >
                        {cert.name}
                      </Text>
                      <Text style={{ fontSize: 7.5, color: C.muted }}>
                        {cert.issuer}
                        {cert.date ? ` · ${fmtDate(cert.date)}` : ""}
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
