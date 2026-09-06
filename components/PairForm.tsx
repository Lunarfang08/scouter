"use client";

import { parseGithubLogin } from "@/lib/username";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function rollRandom(exclude: string[]) {
  const q = exclude.map((e) => `exclude=${encodeURIComponent(e)}`).join("&");
  const res = await fetch(`/api/random?${q}`);
  if (!res.ok) throw new Error("Could not roll a random GitHub user.");
  const data = (await res.json()) as { login: string };
  return data.login;
}

export function PairForm({
  mode,
  leftDefault = "Lunarfang08",
  rightDefault = "",
}: {
  mode: "duel" | "fuse";
  leftDefault?: string;
  rightDefault?: string;
}) {
  const router = useRouter();
  const [left, setLeft] = useState(leftDefault);
  const [right, setRight] = useState(rightDefault);
  const [error, setError] = useState("");
  const [rolling, setRolling] = useState<"left" | "right" | "go" | null>(null);

  function go(aRaw: string, bRaw: string) {
    const a = parseGithubLogin(aRaw);
    const b = parseGithubLogin(bRaw);
    if (!a || !b) {
      setError("Need two GitHub names — type a friend, or roll random.");
      return;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
      setError("Pick two different people.");
      return;
    }
    setError("");
    router.push(`/${mode}/${encodeURIComponent(a)}/${encodeURIComponent(b)}`);
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        go(left, right);
      }}
    >
      <p className="text-sm text-white/50">
        Type a friend’s GitHub, or roll anyone public on GitHub.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-2">
          <input
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="you"
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
          />
        </div>
        <span className="self-center text-xs tracking-[0.2em] text-lime-400 uppercase">
          {mode === "duel" ? "VS" : "FUSE"}
        </span>
        <div className="flex flex-1 gap-2">
          <input
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="friend’s username"
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full bg-[#b7ff3c] px-5 py-3 text-sm font-semibold text-black"
        >
          {mode === "duel" ? "Start duel" : "Fuse"}
        </button>
        <button
          type="button"
          disabled={rolling !== null}
          className="rounded-full border border-lime-400/40 px-5 py-3 text-sm text-lime-300 disabled:opacity-50"
          onClick={async () => {
            setRolling("right");
            setError("");
            try {
              const login = await rollRandom([left]);
              setRight(login);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Random roll failed.");
            } finally {
              setRolling(null);
            }
          }}
        >
          {rolling === "right" ? "Rolling…" : "Random opponent"}
        </button>
        <button
          type="button"
          disabled={rolling !== null}
          className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/80 disabled:opacity-50"
          onClick={async () => {
            const a = parseGithubLogin(left);
            if (!a) {
              setError("Put your GitHub name on the left first.");
              return;
            }
            setRolling("go");
            setError("");
            try {
              const other = await rollRandom([a]);
              setRight(other);
              go(a, other);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Random roll failed.");
              setRolling(null);
            }
          }}
        >
          {rolling === "go" ? "Finding someone…" : mode === "duel" ? "Duel anyone random" : "Fuse with anyone random"}
        </button>
      </div>
      {error ? <p className="text-sm text-stamp">{error}</p> : null}
    </form>
  );
}
