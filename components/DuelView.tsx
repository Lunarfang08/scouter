"use client";

import type { Census } from "@/lib/census";
import { playScouterScan } from "@/lib/audio";
import { useEffect, useState } from "react";

export function DuelView({ a, b }: { a: Census; b: Census }) {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    playScouterScan(Math.max(a.card.powerLevel, b.card.powerLevel) > 9000);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1800);
      const e = 1 - (1 - t) ** 3;
      setLeft(Math.round(a.card.powerLevel * e));
      setRight(Math.round(b.card.powerLevel * e));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [a.card.powerLevel, b.card.powerLevel]);

  const winner = a.card.powerLevel === b.card.powerLevel ? null : a.card.powerLevel > b.card.powerLevel ? a : b;

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="text-center font-[family-name:var(--font-lcd)] text-xs tracking-[0.3em] text-lime-400">
        SCOUTER DUEL
      </p>
      <h1 className="mt-3 text-center text-4xl text-white md:text-6xl">
        {a.user.name} vs {b.user.name}
      </h1>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
        {[a, b].map((c, i) => (
          <div key={c.user.login} className="rounded-[28px] border border-lime-400/30 bg-black/60 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.user.avatar} alt="" className="h-40 w-full rounded-2xl object-cover" />
            <p className="mt-4 text-2xl text-white">{c.user.name}</p>
            <p className="font-[family-name:var(--font-mono)] text-sm text-white/50">@{c.user.login}</p>
            <p className="mt-4 font-[family-name:var(--font-lcd)] text-5xl text-lime-300">
              {(i === 0 ? left : right).toLocaleString()}
            </p>
            <p className="text-sm text-white/45">{c.card.role}</p>
          </div>
        ))}
      </div>
      {done ? (
        <p className="mt-10 text-center text-3xl text-white">
          {winner ? `${winner.user.name} takes the reading.` : "Perfect clash. Both scouters explode."}
        </p>
      ) : (
        <p className="mt-10 text-center font-[family-name:var(--font-lcd)] text-lime-400">SCANNING…</p>
      )}
    </div>
  );
}
