"use client";

import { parseGithubLogin } from "@/lib/username";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchForm({
  initial = "",
  size = "lg",
}: {
  initial?: string;
  size?: "lg" | "sm";
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");

  return (
    <form
      className={`w-full ${size === "lg" ? "max-w-xl" : "max-w-sm"}`}
      onSubmit={(e) => {
        e.preventDefault();
        const login = parseGithubLogin(value);
        if (!login) {
          setError("Use your GitHub name (Lunarfang08) or paste the profile link.");
          return;
        }
        setError("");
        router.push(`/c/${encodeURIComponent(login)}`);
      }}
    >
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          placeholder="username or github.com/you"
          spellCheck={false}
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 font-[family-name:var(--font-mono)] text-sm tracking-wide text-white outline-none placeholder:text-white/30 focus:border-cyan-300"
          aria-label="GitHub username or profile URL"
        />
        <button
          type="submit"
          className="rounded-full bg-[#b7ff3c] px-5 py-3 text-sm font-semibold tracking-wide text-black hover:brightness-110"
        >
          Scan
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-stamp">{error}</p> : null}
    </form>
  );
}
