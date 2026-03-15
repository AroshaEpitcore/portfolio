import { Metadata } from "next";
import { getGitHubRepos, getGitHubUser } from "@/lib/github";
import { GitHubPageClient } from "./github-page";

export const metadata: Metadata = {
  title: "GitHub Repositories",
  description: "Browse all my open source projects and repositories on GitHub.",
};

export default async function GitHubPage() {
  const [repos, user] = await Promise.all([getGitHubRepos(), getGitHubUser()]);

  return <GitHubPageClient repos={repos} user={user} />;
}
