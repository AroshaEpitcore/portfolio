export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  pushed_at: string;
  updated_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  visibility: string;
  open_issues_count: number;
  default_branch: string;
  size: number;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
}

export const GITHUB_USERNAME = "AroshaRavishan";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const GITHUB_API = "https://api.github.com";

const fetchOpts: RequestInit = {
  next: { revalidate: 3600 },
  headers: { Accept: "application/vnd.github.v3+json" },
};

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`,
      fetchOpts
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.filter((r) => !r.fork && !r.archived);
  } catch {
    return [];
  }
}

export async function getGitHubUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, fetchOpts);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Language → badge color map
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Vue: "#41b883",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  SCSS: "#c6538c",
};
