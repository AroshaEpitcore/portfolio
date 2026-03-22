const TECH_KEYWORDS: Record<string, string[]> = {
  // Languages
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  Python: ["python"],
  Java: ["java"],
  Go: ["golang", " go "],
  Rust: ["rust"],
  PHP: ["php"],
  "C#": ["c#", "csharp"],
  "C++": ["c++"],
  Swift: ["swift"],
  Kotlin: ["kotlin"],
  // Frontend frameworks
  React: ["react"],
  "Next.js": ["next.js", "nextjs"],
  Vue: ["vue.js", "vuejs", " vue "],
  Angular: ["angular"],
  Svelte: ["svelte"],
  Astro: ["astro"],
  // Backend
  "Node.js": ["node.js", "nodejs"],
  Express: ["express.js", "expressjs"],
  Django: ["django"],
  Laravel: ["laravel"],
  FastAPI: ["fastapi"],
  // Styling
  "Tailwind CSS": ["tailwind"],
  CSS: [" css "],
  Sass: ["sass", "scss"],
  Bootstrap: ["bootstrap"],
  // Databases
  PostgreSQL: ["postgresql", "postgres"],
  MongoDB: ["mongodb"],
  MySQL: ["mysql"],
  Redis: ["redis"],
  SQLite: ["sqlite"],
  Supabase: ["supabase"],
  Firebase: ["firebase"],
  // DevOps / Cloud
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  AWS: [" aws ", "amazon web services"],
  Vercel: ["vercel"],
  Netlify: ["netlify"],
  Git: [" git "],
  GitHub: ["github"],
  // Concepts
  "REST API": ["rest api", "restful"],
  GraphQL: ["graphql"],
  Testing: ["testing", "unit test", "jest", "vitest"],
  Performance: ["performance", "optimization"],
  Security: ["security", "authentication", "oauth"],
  SEO: [" seo "],
  Accessibility: ["accessibility", "a11y"],
  Frontend: ["frontend", "front-end"],
  Backend: ["backend", "back-end"],
  "Full Stack": ["full stack", "fullstack"],
  "UI/UX": ["ui/ux", "user interface", "user experience"],
};

export function extractTagsFromContent(content: string): string[] {
  const lower = content.toLowerCase();
  const found: string[] = [];
  for (const [tag, patterns] of Object.entries(TECH_KEYWORDS)) {
    if (patterns.some((p) => lower.includes(p))) {
      found.push(tag);
    }
  }
  return found.slice(0, 10);
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
