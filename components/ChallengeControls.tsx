"use client";

import { parseGithubLogin } from "@/lib/username";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChallengeControls({ login }: { login: string }) {
  const router = useRouter();
  const [friend, setFriend] = useState("");
  const [busy, setBusy] = useState<"duel" | "fuse" | "roll" | null>(null);
  const [error, setError] = useState("");

  async function randomLogin() {
    const res = await fetch(`/api/random?exclude=${encodeURIComponent(login)}`);
    if (!res.ok) throw new Error("Could not find a random GitHub user.");
    const data = (await res.json()) as { login: string };
    return data.login;
  }

  async function start(mode: "duel" | "fuse", otherRaw: string) {
    const other = parseGithubLogin(otherRaw);
    if (!other) {
      setError("Type a friend’s GitHub, or hit random.");
      return;
    }
    if (other.toLowerCase() === login.toLowerCase()) {
      setError("Pick someone else.");
      return;
    }
    router.push(`/${mode}/${encodeURIComponent(login)}/${encodeURIComponent(other)}`);
  }

  return (
    <div className="mt-8 w-full max-w-xl space-y-3">
      <p className="text-center text-sm text-white/50">
        Duel or fuse with a friend — or roll a random person on GitHub.
      </p>
      <div className="flex gap-2">
        <input
          value={friend}
          onChange={(e) => {
            setFriend(e.target.value);
            if (error) setError("");
          }}
          placeholder="friend’s username"
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
        />
        <button
          type="button"
          disabled={busy !== null}
          className="rounded-full border border-lime-400/40 px-4 py-3 text-sm text-lime-300 disabled:opacity-50"
          onClick={async () => {
            setBusy("roll");
            setError("");
            try {
              setFriend(await randomLogin());
            } catch (err) {
              setError(err instanceof Error ? err.message : "Roll failed.");
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "roll" ? "…" : "Random"}
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => start("duel", friend)}
          className="rounded-full border border-lime-400/40 px-6 py-3 text-sm text-lime-300"
        >
          Duel this person
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => start("fuse", friend)}
          className="rounded-full border border-stamp/40 px-6 py-3 text-sm text-stamp"
        >
          Fuse with this person
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("duel");
            setError("");
            try {
              const other = await randomLogin();
              setFriend(other);
              await start("duel", other);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Roll failed.");
              setBusy(null);
            }
          }}
          className="rounded-full bg-[#b7ff3c] px-6 py-3 text-sm font-semibold text-black"
        >
          {busy === "duel" ? "Finding rival…" : "Duel anyone random"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setBusy("fuse");
            setError("");
            try {
              const other = await randomLogin();
              setFriend(other);
              await start("fuse", other);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Roll failed.");
              setBusy(null);
            }
          }}
          className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80"
        >
          {busy === "fuse" ? "Finding partner…" : "Fuse with anyone random"}
        </button>
      </div>
      {error ? <p className="text-center text-sm text-stamp">{error}</p> : null}
    </div>
  );
}
