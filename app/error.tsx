"use client";

export default function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-8 py-24">
      <p className="text-sm uppercase tracking-[0.2em] text-stamp">Something broke</p>
      <h1 className="mt-4 max-w-3xl text-4xl">{error.message || "Could not generate the cast."}</h1>
      <button type="button" onClick={reset} className="mt-6 border border-white/30 px-4 py-2 text-sm text-white">
        Try again
      </button>
    </main>
  );
}
