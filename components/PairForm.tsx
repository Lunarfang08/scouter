"use client";

import { parseGithubLogin } from "@/lib/username";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PairForm({
  mode,
  leftDefault = "Lunarfang08",
  rightDefault = "torvalds",
}: {
  mode: "duel" | "fuse";
  leftDefault?: string;
  rightDefault?: string;
}) {
  const router = useRouter();
  const [left, setLeft] = useState(leftDefault);
  const [right, setRight] = useState(rightDefault);
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const a = parseGithubLogin(left);
        const b = parseGithubLogin(right);
        if (!a || !b) {
          setError("Need two GitHub usernames.");
          return;
        }
        if (a.toLowerCase() === b.toLowerCase()) {
          setError("Pick two different people.");
          return;
        }
        router.push(`/${mode}/${encodeURIComponent(a)}/${encodeURIComponent(b)}`);
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          placeholder="you"
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
        />
        <span className="self-center text-xs tracking-[0.2em] text-lime-400 uppercase">
          {mode === "duel" ? "VS" : "FUSE"}
        </span>
        <input
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder="rival"
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-[#b7ff3c] px-5 py-3 text-sm font-semibold text-black"
      >
        {mode === "duel" ? "Start duel" : "Fuse"}
      </button>
      {error ? <p className="text-sm text-stamp">{error}</p> : null}
    </form>
  );
}
