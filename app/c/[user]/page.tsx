import { CensusView } from "@/components/CensusView";
import { GithubError } from "@/lib/github";
import { loadCensus } from "@/lib/load";
import { parseGithubLogin } from "@/lib/username";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ user: string }>;
  searchParams: Promise<{ squad?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await params;
  const login = parseGithubLogin(user) ?? user;
  return {
    title: `Scouter · ${login}`,
    description: `Anime card and 1,000-character cast generated from GitHub/${login}.`,
  };
}

export default async function CensusPage({ params, searchParams }: Props) {
  const { user } = await params;
  const { squad } = await searchParams;
  const login = parseGithubLogin(user);
  if (!login) {
    return (
      <main className="px-8 py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-stamp">Couldn’t read that</p>
        <h1 className="mt-4 max-w-3xl text-4xl text-white">
          Use a GitHub username like Lunarfang08, or paste the profile URL.
        </h1>
        <Link href="/" className="mt-6 inline-block underline">
          Back
        </Link>
      </main>
    );
  }
  if (login !== user) redirect(`/c/${login}`);

  const initialSquad = (squad ?? "")
    .split(",")
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n > 0);

  try {
    const census = await loadCensus(login);
    return <CensusView census={census} initialSquad={initialSquad} />;
  } catch (err) {
    if (err instanceof GithubError && err.status === 404) notFound();
    if (err instanceof GithubError) {
      return (
        <main className="px-8 py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-stamp">Couldn’t load GitHub</p>
          <h1 className="mt-4 max-w-3xl text-4xl text-white">{err.message}</h1>
          <Link href="/" className="mt-6 inline-block underline">
            Back
          </Link>
        </main>
      );
    }
    throw err;
  }
}
