"use client";

import type { Census } from "@/lib/census";
import { ChallengeControls } from "./ChallengeControls";
import { playScouterScan } from "@/lib/audio";
import { useEffect, useState } from "react";

export function HeroCard({ census }: { census: Census }) {
  const { card, user, vessel, flavor } = census;
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [shownPower, setShownPower] = useState(0);
  const [scanKey, setScanKey] = useState(0);
  const [activeTrait, setActiveTrait] = useState(0);
  const ink = vessel.house.ink;

  useEffect(() => {
    setScanning(true);
    setShownPower(0);
    const target = card.powerLevel;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = 1 - (1 - t) ** 3;
      setShownPower(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setScanning(false);
    };
    frame = requestAnimationFrame(tick);
    playScouterScan(target > 9000);
    return () => cancelAnimationFrame(frame);
  }, [card.powerLevel, scanKey]);

  function tilt(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
  }

  function untilt(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = "rotateY(0) rotateX(0)";
  }

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  const over9000 = card.powerLevel > 9000;

  return (
    <div className="flex w-full flex-col items-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.35em] text-lime-400 uppercase">
        scouter locked · {card.role}
      </p>
      <h1 className="mt-2 text-center text-5xl font-semibold tracking-tight text-white md:text-7xl">
        {user.name}
      </h1>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-white/55">
        @{user.login} · {flavor.village}
      </p>
      <p className="mt-2 max-w-xl text-center text-lg italic text-cyan-200">“{flavor.catchphrase}”</p>
      <p className="mt-1 text-center text-sm text-gold">{flavor.weapon.name}</p>

      <div className="mt-8 flex w-full max-w-5xl flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center">
        <button
          type="button"
          onClick={() => {
            playScouterScan(card.powerLevel > 9000);
            setScanKey((n) => n + 1);
          }}
          className="scouter relative w-full max-w-sm shrink-0 overflow-hidden rounded-[32px] border border-lime-400/40 bg-black/70 p-5 text-left shadow-[0_0_80px_rgba(163,255,58,0.18)]"
        >
          <div className="scanline pointer-events-none absolute inset-0" />
          <div className="flex items-center justify-between">
            <p className="font-[family-name:var(--font-lcd)] text-xs tracking-[0.3em] text-lime-400">
              POWER SCOUTER
            </p>
            <span className={`h-2 w-2 rounded-full ${scanning ? "animate-ping bg-lime-300" : "bg-lime-400"}`} />
          </div>
          <p className="mt-4 font-[family-name:var(--font-lcd)] text-[11px] tracking-[0.25em] text-lime-600">
            KI READING
          </p>
          <p className="font-[family-name:var(--font-lcd)] text-6xl leading-none text-lime-300 tabular-nums [text-shadow:0_0_18px_#b7ff3c]">
            {shownPower.toLocaleString()}
          </p>
          <p className="mt-2 font-[family-name:var(--font-lcd)] text-sm text-lime-500">
            {scanning ? "SCANNING…" : over9000 ? "IT'S OVER 9000" : "LOCKED"}
          </p>
          <p className="mt-4 text-xs text-lime-700">tap to rescan</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {card.stats.map((s) => (
              <div key={s.key} className="rounded-lg border border-lime-400/20 bg-lime-400/5 px-2 py-2">
                <p className="font-[family-name:var(--font-lcd)] text-[10px] text-lime-600">{s.key}</p>
                <p className="font-[family-name:var(--font-lcd)] text-lg text-lime-300">{s.value}</p>
              </div>
            ))}
          </div>
        </button>

        <div className="perspective-card w-full max-w-[360px]">
          <div
            className="holo-card relative cursor-pointer transition-transform duration-150"
            onMouseMove={tilt}
            onMouseLeave={untilt}
            onClick={() => setFlipped((v) => !v)}
          >
            <div
              className="relative overflow-hidden rounded-[28px] p-[3px]"
              style={{
                background: `conic-gradient(from 180deg, ${ink}, #f5d76e, #ff4fd8, #5ce1ff, ${ink})`,
              }}
            >
              <div className="relative min-h-[520px] overflow-hidden rounded-[25px] bg-[#070814]">
                <div className="holo-sheen pointer-events-none absolute inset-0 z-10" />
                {!flipped ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.avatar} alt="" className="h-[340px] w-full object-cover" />
                    <div className="absolute inset-x-0 top-0 z-20 flex justify-between p-4">
                      <span className="rounded-full bg-black/55 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] text-gold">
                        {card.language}
                      </span>
                      <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] tracking-[0.2em] text-cyan-300">
                        FLIP
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-5">
                      <p className="text-3xl font-semibold leading-none text-white">{user.name}</p>
                      <p className="mt-1 font-[family-name:var(--font-mono)] text-sm text-white/60">
                        @{user.login}
                      </p>
                      <p className="mt-3 text-sm text-cyan-200">{card.role}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[520px] flex-col justify-between p-6">
                    <div>
                      <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.25em] text-stamp uppercase">
                        anime traits
                      </p>
                      <ul className="mt-4 space-y-3">
                        {card.traits.map((t) => (
                          <li key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-white">{t.name}</p>
                            <p className="text-sm text-white/50">{t.hint}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-center text-xs text-white/35">tap to flip back</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-white/35">move mouse to tilt · click to flip</p>
        </div>
      </div>

      <div className="mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {card.traits.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setActiveTrait(i)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeTrait === i
                ? "border-lime-300 bg-lime-300 text-black"
                : "border-white/20 text-white/80 hover:border-white/50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-md text-center text-sm text-white/50">{card.traits[activeTrait]?.hint}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={share}
          className="rounded-full bg-[#b7ff3c] px-6 py-3 text-sm font-semibold text-black hover:brightness-110"
        >
          {copied ? "Link copied" : "Share my card"}
        </button>
        <a
          href={`/api/og/${user.login}`}
          className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:border-white/50"
        >
          Download image
        </a>
      </div>
      <ChallengeControls login={user.login} />
    </div>
  );
}
