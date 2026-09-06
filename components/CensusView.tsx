"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Census, Citizen, Rank } from "@/lib/census";
import { spritePath } from "@/lib/census";
import { HeroCard } from "./HeroCard";
import { SearchForm } from "./SearchForm";
import { Sprite } from "./Sprite";

const FILTERS: { id: Rank | "all"; label: string }[] = [
  { id: "all", label: "All 1000" },
  { id: "named", label: "Named" },
  { id: "hollow", label: "Hollow" },
  { id: "chorus", label: "Chorus" },
];

function CitizenRow({
  citizen,
  active,
  onSelect,
}: {
  citizen: Citizen;
  active?: boolean;
  onSelect?: (c: Citizen) => void;
}) {
  const sprite = spritePath(citizen);
  return (
    <button
      type="button"
      onClick={() => onSelect?.(citizen)}
      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
        active ? "border-stamp/60 bg-stamp/10" : "border-white/10 hover:border-white/25"
      }`}
    >
      <Sprite cells={sprite.cells} ink={sprite.ink} size={44} />
      <div className="min-w-0">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
          #{String(citizen.id).padStart(4, "0")} · {citizen.rank}
        </p>
        <h3 className="truncate text-base text-white">{citizen.name}</h3>
        <p className="truncate text-sm text-white/45">{citizen.epithet}</p>
      </div>
    </button>
  );
}

export function CensusView({
  census,
  initialSquad = [],
}: {
  census: Census;
  initialSquad?: number[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Rank | "all">("all");
  const [selected, setSelected] = useState<Citizen>(census.vessel);
  const [query, setQuery] = useState("");
  const [squad, setSquad] = useState<number[]>(() => {
    const cleaned = initialSquad.filter((id) => id !== 1 && census.citizens.some((c) => c.id === id));
    return [1, ...cleaned].slice(0, 5);
  });

  function setSquadAndUrl(next: number[]) {
    const unique = [1, ...next.filter((id) => id !== 1)].slice(0, 5);
    setSquad(unique);
    const extras = unique.filter((id) => id !== 1);
    const path = `/c/${census.user.login}${extras.length ? `?squad=${extras.join(",")}` : ""}`;
    router.replace(path, { scroll: false });
  }

  function toggleSquad(id: number) {
    if (id === 1) return;
    if (squad.includes(id)) setSquadAndUrl(squad.filter((x) => x !== id));
    else if (squad.length < 5) setSquadAndUrl([...squad, id]);
  }

  const squadPeople = squad
    .map((id) => census.citizens.find((c) => c.id === id))
    .filter((c): c is Citizen => Boolean(c));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return census.citizens.filter((c) => {
      if (filter !== "all" && c.rank !== filter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.epithet.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        (c.repo ?? "").toLowerCase().includes(q)
      );
    });
  }, [census.citizens, filter, query]);

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-10">
        <Link href="/" className="text-sm tracking-[0.28em] uppercase text-white/80">
          Scouter
        </Link>
        <SearchForm initial={census.user.login} size="sm" />
      </header>

      <section className="px-5 py-10 md:px-10">
        <HeroCard census={census} />
        <p className="mt-4 text-center text-xs text-white/35">{census.flavor.villageNote}</p>
      </section>

      <section className="px-5 md:px-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-gold">
            Squad of 5 · vessel locked
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {squadPeople.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className="rounded-full border border-white/20 px-3 py-1 text-sm text-white"
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40">
            Click a character below, then “Add to squad”. Share this URL — the team rides with it.
          </p>
        </div>
      </section>

      <section className="mt-10 px-5 md:px-10">
        <h2 className="text-xl text-white">Season recap</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {census.seasons.map((s) => (
            <article key={s.year} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-[family-name:var(--font-lcd)] text-lime-400">{s.year}</p>
              <h3 className="mt-1 text-white">{s.arc}</h3>
              <ul className="mt-3 space-y-1 text-sm text-white/55">
                {s.episodes.map((ep) => (
                  <li key={ep.repo}>{ep.title}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl text-white">The other 999</h2>
          <p className="font-[family-name:var(--font-mono)] text-xs text-white/40">
            each square is a character — click one
          </p>
        </div>
        <div className="grid-census rounded-xl border border-white/10 p-2">
          {census.citizens.map((c) => (
            <button
              key={c.id}
              title={`${c.name} · ${c.rank}`}
              onClick={() => {
                setSelected(c);
                setFilter(c.rank === "chorus" ? "chorus" : c.rank);
              }}
              className="aspect-square"
              style={{
                background:
                  selected.id === c.id ? "#ff4fd8" : c.rank === "hollow" ? "#05060c" : c.house.ink,
                opacity: c.rank === "chorus" ? 0.75 : 1,
                outline: squad.includes(c.id) ? "2px solid #f5d76e" : undefined,
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/45">
          {census.houses.map((h) => (
            <span key={h.house.id} className="flex items-center gap-2">
              <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: h.house.ink }} />
              {h.house.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 px-5 pb-24 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-stamp">
            Character
          </p>
          <div className="mt-4 flex items-start gap-4">
            <Sprite
              cells={spritePath(selected).cells}
              ink={spritePath(selected).ink}
              size={72}
            />
            <div>
              <h3 className="text-2xl text-white">{selected.name}</h3>
              <p className="text-white/50">{selected.epithet}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-300">
                {selected.rank} · {selected.house.name}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{selected.role}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/65">
            {selected.story}
          </p>
          {selected.repo ? (
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-white/40">
              bound repo · {selected.repo}
            </p>
          ) : null}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Ability</p>
            <p className="mt-1 text-xl text-white">{selected.seal.name}</p>
            <p className="text-sm text-white/55">{selected.seal.nature}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{selected.seal.lore}</p>
          </div>
          <p className="mt-4 text-xs italic text-white/35">{selected.house.creed}</p>
          {selected.id !== 1 ? (
            <button
              type="button"
              onClick={() => toggleSquad(selected.id)}
              className="mt-4 rounded-full border border-gold/50 px-4 py-2 text-sm text-gold"
            >
              {squad.includes(selected.id) ? "Remove from squad" : "Add to squad"}
            </button>
          ) : (
            <p className="mt-4 text-xs text-white/35">The vessel is always on the squad.</p>
          )}
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  filter === f.id ? "border-white bg-white text-black" : "border-white/15 text-white/70"
                }`}
              >
                {f.label}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="find a name"
              className="ml-auto rounded-full border border-white/15 bg-transparent px-3 py-1 font-[family-name:var(--font-mono)] text-sm text-white outline-none"
            />
          </div>
          <div className="grid max-h-[640px] gap-2 overflow-auto sm:grid-cols-2">
            {visible.slice(0, 80).map((c) => (
              <CitizenRow
                key={c.id}
                citizen={c}
                active={selected.id === c.id}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
