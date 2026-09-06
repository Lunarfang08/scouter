import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-8 py-24">
      <p className="text-sm uppercase tracking-[0.2em] text-stamp">Not on GitHub</p>
      <h1 className="mt-4 text-5xl text-white">No user with that name.</h1>
      <Link href="/" className="mt-6 inline-block underline">
        Back
      </Link>
    </main>
  );
}
