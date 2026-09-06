import { parseGithubLogin } from "@/lib/username";
import { unstable_cache } from "next/cache";

export type GithubUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
  created_at: string;
  size: number;
};

export class GithubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "scouter-git-cast",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGithubJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers(), next: { revalidate: 3600 } });
  if (res.status === 404) throw new GithubError("GitHub has no user with that name.", 404);
  if (res.status === 403) {
    throw new GithubError(
      "GitHub rate limit hit. Add a GITHUB_TOKEN in .env.local and restart.",
      403,
    );
  }
  if (!res.ok) throw new GithubError(`GitHub error (${res.status}). Try again in a minute.`, res.status);
  return res.json() as Promise<T>;
}

export type GithubBundle = {
  user: GithubUser;
  repos: GithubRepo[];
  catchphrase: string | null;
  weaponRepo: GithubRepo | null;
};

type GithubEvent = {
  type: string;
  payload?: { commits?: { message: string }[] };
};

async function lastPushMessage(login: string): Promise<string | null> {
  try {
    const events = await fetchGithubJson<GithubEvent[]>(
      `https://api.github.com/users/${encodeURIComponent(login)}/events/public?per_page=30`,
    );
    for (const ev of events) {
      const commits = ev.payload?.commits;
      const msg = commits?.[commits.length - 1]?.message;
      if (msg?.trim()) return msg;
    }
  } catch {
    return null;
  }
  return null;
}

async function pinnedRepoName(login: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query($login:String!){ user(login:$login){ pinnedItems(first:1, types:REPOSITORY){ nodes { ... on Repository { name } } } } }`,
        variables: { login },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { user?: { pinnedItems?: { nodes?: { name?: string }[] } } };
    };
    return json.data?.user?.pinnedItems?.nodes?.[0]?.name ?? null;
  } catch {
    return null;
  }
}

async function loadProfile(username: string): Promise<GithubBundle> {
  const login = parseGithubLogin(username);
  if (!login) {
    throw new GithubError(
      "Need a GitHub username like Lunarfang08 — a full URL works too.",
      400,
    );
  }

  const [user, repos, catchphrase, pinned] = await Promise.all([
    fetchGithubJson<GithubUser>(`https://api.github.com/users/${encodeURIComponent(login)}`),
    fetchGithubJson<GithubRepo[]>(
      `https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated&type=owner`,
    ),
    lastPushMessage(login),
    pinnedRepoName(login),
  ]);

  const owned = repos.filter((r) => !r.fork);
  const list = owned.length ? owned : repos;
  const byStars = [...list].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const weaponRepo = (pinned && list.find((r) => r.name === pinned)) || byStars[0] || null;

  return { user, repos: list, catchphrase, weaponRepo };
}

export const getGithubProfile = unstable_cache(
  async (username: string) => loadProfile(username),
  ["github-profile-v2"],
  { revalidate: 3600 },
);

type ListedUser = { login: string; type: string };

export async function pickRandomGithubLogin(exclude: string[] = []): Promise<string> {
  const skip = new Set(exclude.map((s) => s.toLowerCase()).filter(Boolean));
  for (let i = 0; i < 12; i++) {
    const since = Math.floor(Math.random() * 160_000_000);
    const res = await fetch(`https://api.github.com/users?per_page=50&since=${since}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) continue;
    const users = (await res.json()) as ListedUser[];
    const people = users.filter((u) => u.type === "User" && !skip.has(u.login.toLowerCase()));
    if (people.length) {
      return people[Math.floor(Math.random() * people.length)]!.login;
    }
  }
  return skip.has("octocat") ? "torvalds" : "octocat";
}
