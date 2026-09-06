import { pick } from "./rng";

export function villageFromLocation(location: string | null) {
  if (!location?.trim()) {
    return { name: "No Village (Wanderer)", note: "GitHub listed no location. You travel between compilers." };
  }
  const loc = location.trim();
  const key = loc.toLowerCase();
  const map: Record<string, string> = {
    pakistan: "Hidden Sand Compiler Village",
    india: "Monsoon Hashira Village",
    japan: "Leaf of Infinite Commits",
    "united states": "West Coast Chakra Yards",
    usa: "West Coast Chakra Yards",
    germany: "Iron Spec Village",
    france: "Glass Thread Atelier",
    "united kingdom": "Fog of Legacy Code",
    uk: "Fog of Legacy Code",
    canada: "Northern Quiet Village",
    brazil: "Carnival of Forks",
    china: "Great Wall of Types",
    korea: "Idol Pipeline Village",
    "south korea": "Idol Pipeline Village",
    algeria: "Desert of Nightly Builds",
    nigeria: "Harmattan Merge Village",
    egypt: "Delta of Deadlines",
    turkey: "Bosphorus Rebase",
    indonesia: "Archipelago of Side Quests",
    australia: "Upside-Down CI Village",
  };
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return { name: v, note: `Mapped from GitHub location: ${loc}` };
  }
  return { name: `Hidden Village of ${loc}`, note: `Mapped from GitHub location: ${loc}` };
}

export function cleanCatchphrase(raw: string | null) {
  if (!raw?.trim()) return "…the commit was silent.";
  const line = raw.split("\n")[0]!.trim().slice(0, 90);
  if (!line || /^merge /i.test(line)) return "Merge in the rain. Keep walking.";
  return line;
}

export function seasonArcName(rand: () => number, year: number) {
  return `${year} Arc — ${pick(rand, [
    "The Unmerged Rain",
    "Night of a Thousand PRs",
    "When the Pipeline Turned Red",
    "Side Quest Overflow",
    "The Quiet Refactor",
    "Stars Fall on main",
    "Return of the Hollow Repo",
  ])}`;
}
