"use client";

import type { Census } from "@/lib/census";
import { playScouterScan } from "@/lib/audio";
import { fusedKi, fusedTraits, fuseNames } from "@/lib/fusion";
import { useEffect, useState } from "react";

export function FusionView({ a, b }: { a: Census; b: Census }) {
  const name = fuseNames(a.user.name, b.user.name);
  const ki = fusedKi(a, b);
  const traits = fusedTraits(a, b);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    playScouterScan(ki > 9000);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      setShown(Math.round(ki * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ki]);

  return (
    <div className="px-5 py-10 md:px-10">
      <p className="text-center font-[family-name:var(--font-lcd)] text-xs tracking-[0.3em] text-stamp">
        POTARA LOCK · FUSION
      </p>
      <h1 className="mt-3 text-center text-5xl text-white md:text-7xl">{name}</h1>
      <p className="mt-2 text-center text-white/50">
        @{a.user.login} × @{b.user.login} · ki boosted 15%
      </p>
      <div className="mx-auto mt-8 flex max-w-md justify-center -space-x-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.user.avatar} alt="" className="h-40 w-40 rounded-full border-4 border-black object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.user.avatar} alt="" className="h-40 w-40 rounded-full border-4 border-black object-cover" />
      </div>
      <p className="mt-8 text-center font-[family-name:var(--font-lcd)] text-6xl text-lime-300">
        {shown.toLocaleString()}
      </p>
      <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
        {traits.map((t) => (
          <span key={t.name} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80">
            {t.name}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-lg text-center text-white/55">
        Weapon fusion: {a.flavor.weapon.name} + {b.flavor.weapon.name}. Village clash: {a.flavor.village} /{" "}
        {b.flavor.village}.
      </p>
    </div>
  );
}
