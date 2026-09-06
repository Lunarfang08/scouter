import { FusionView } from "@/components/FusionView";
import { GithubError } from "@/lib/github";
import { loadCensus } from "@/lib/load";
import { parseGithubLogin } from "@/lib/username";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ a: string; b: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { a, b } = await params;
  return { title: `Scouter fusion · ${a} × ${b}` };
}

export default async function FusePage({ params }: Props) {
  const { a, b } = await params;
  const left = parseGithubLogin(a);
  const right = parseGithubLogin(b);
  if (!left || !right) notFound();
  try {
    const [ca, cb] = await Promise.all([loadCensus(left), loadCensus(right)]);
    return (
      <div className="min-h-screen">
        <header className="px-5 py-4 md:px-10">
          <Link href="/" className="text-sm tracking-[0.28em] uppercase text-white/80">
            Scouter
          </Link>
        </header>
        <FusionView a={ca} b={cb} />
      </div>
    );
  } catch (err) {
    if (err instanceof GithubError && err.status === 404) notFound();
    throw err;
  }
}
