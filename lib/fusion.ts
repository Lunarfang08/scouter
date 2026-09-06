import { hashString } from "./rng";
import type { Census } from "./census";

export function fuseNames(a: string, b: string) {
  const left = a.replace(/\s+/g, "").slice(0, Math.max(3, Math.ceil(a.length * 0.45)));
  const right = b.replace(/\s+/g, "").slice(Math.floor(b.length * 0.45));
  return `${left}${right}`;
}

export function fusedKi(a: Census, b: Census) {
  return Math.round((a.card.powerLevel + b.card.powerLevel) * 1.15);
}

export function fusedTraits(a: Census, b: Census) {
  const seen = new Set<string>();
  const out = [];
  for (const t of [...a.card.traits, ...b.card.traits]) {
    if (seen.has(t.name)) continue;
    seen.add(t.name);
    out.push(t);
  }
  return out.slice(0, 4);
}

export function fusionSeed(a: string, b: string) {
  return hashString(`fuse:${[a.toLowerCase(), b.toLowerCase()].sort().join("|")}`);
}
