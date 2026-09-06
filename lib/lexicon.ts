import { pick } from "./rng";

const HEADS = [
  "Aka", "Aoi", "Asa", "Chi", "Fuyu", "Gin", "Hana", "Hoshi", "Ichi", "Ishi",
  "Kage", "Kairo", "Kana", "Kiri", "Kuro", "Mizu", "Nami", "Neo", "Nochi", "Ori",
  "Rei", "Rin", "Sayo", "Shiro", "Sora", "Suzu", "Taka", "Tsuki", "Umi", "Yoru",
  "Yume", "Zen", "Zero", "Aku", "Haku", "Raku", "Toki", "Wata", "Yuu", "Saki",
];

const CORES = [
  "bana", "bora", "dari", "dori", "fune", "gara", "hane", "hara", "kage", "kami",
  "kaze", "koto", "kure", "mari", "mono", "mori", "nari", "neko", "nori", "raze",
  "ren", "roshi", "rune", "saki", "sane", "seki", "shimo", "shira", "suke", "tama",
  "tera", "tori", "tsuru", "vara", "yama", "yomi", "zora", "zumi", "hex", "bit",
];

const TAILS = [
  "maru", "ko", "shi", "to", "ya", "no", "ra", "ou", "en", "el",
  "ix", "os", "an", "eon", "ami", "iro", "uta", "mei", "sai", "zen",
  "null", "void", "arc", "node", "diff", "hook", "lint", "push", "pull", "merge",
];

const EPITHETS = [
  "of the Unmerged Branch",
  "Who Indexes the Dead",
  "Keeper of Nightly Builds",
  "the Soft Revert",
  "Born Between Tags",
  "Who Speaks in Diffs",
  "Last Reviewer at Dawn",
  "of the Frozen Lockfile",
  "Who Eats Deprecated APIs",
  "Stitcher of Broken Types",
  "the Quiet Maintainer",
  "Who Named the Bug After a God",
  "of One-Line PRs",
  "Who Never Closed the Issue",
  "Flame of the CI Gate",
  "the Archived Smile",
  "Who Dreams in YAML",
  "Breaker of Circular Imports",
  "the Thousandth Extra",
  "Who Guards the README Shrine",
  "Child of Force-Push Weather",
  "the Unassigned Ticket",
  "Who Walks the Blame View",
  "Scribe of Empty Commits",
  "the Fork That Lived",
  "Who Hears the Linter Sing",
  "of the Red Pipeline",
  "the Side-Project Saint",
  "Who Bottles Stack Traces",
  "Warden of Hidden TODOs",
];

const CHORUS_ROLES = [
  "background extra in episode 7",
  "tea seller outside the compiler shrine",
  "unnamed classmate who gasps on cue",
  "lantern-bearer in the opening credits",
  "crowd member who points at the sky",
  "night-shift typesetter of error logs",
  "festival mask that never comes off",
  "train conductor on the infinite rebase",
  "shrine cat with admin privileges",
  "ghost of a deleted function",
  "understudy for the rival",
  "map extra in the credits scroll",
  "vendor of counterfeit stars",
  "child who saw the first commit",
  "archivist of unread comments",
  "drum in the insert song",
  "bodyguard who only blocks merge conflicts",
  "rain that falls in every flashback",
  "npc who knows the true ending",
  "stagehand behind the domain wall",
];

export function makeName(rand: () => number, taken: Set<string>, id: number): string {
  for (let i = 0; i < 12; i++) {
    const name = `${pick(rand, HEADS)}${pick(rand, CORES)}${pick(rand, TAILS)}`;
    if (!taken.has(name)) {
      taken.add(name);
      return name;
    }
  }
  const fallback = `Citizen-${String(id).padStart(4, "0")}`;
  taken.add(fallback);
  return fallback;
}

export function epithet(rand: () => number) {
  return pick(rand, EPITHETS);
}

export function chorusRole(rand: () => number) {
  return pick(rand, CHORUS_ROLES);
}

const TITLE_A = [
  "Chronicle",
  "Census",
  "Requiem",
  "Compilation",
  "Night Record",
  "Unfinished Arc",
  "Second Season",
  "Quiet War",
  "Paper Shrine",
  "Last Diff",
];

const TITLE_B = [
  "of a Thousand Names",
  "of the Uncompiled City",
  "for Abandoned Repos",
  "of Glass Threads",
  "Signed in Blood Tests",
  "Where Stars Are Currency",
  "of the Soft Fang",
  "After the Force Push",
  "of People Left in Code",
  "Rated Nobody, Loved by Extras",
];

export function seriesTitle(rand: () => number, display: string) {
  return `${display}: ${pick(rand, TITLE_A)} ${pick(rand, TITLE_B)}`;
}

const STUDIOS = [
  "Lockfile Pictures",
  "Blame View Works",
  "Nightly Build Studio",
  "Unmerged Frames",
  "Kotowari Animation",
  "Paper CI",
  "Hollow Branch Film",
  "Thousand Extra Lab",
];

export function studioName(rand: () => number) {
  return pick(rand, STUDIOS);
}

const OPENINGS = [
  "Commit Until Morning",
  "Names We Left in main",
  "A Thousand Backgrounds",
  "Red, Then Green",
  "The Extra Who Looked Back",
  "Star Count Lullaby",
  "Do Not Force Push My Heart",
  "Season 0 Was Real",
];

export function openingTheme(rand: () => number) {
  return pick(rand, OPENINGS);
}

const SEAL_VERBS = [
  "Bind",
  "Unroll",
  "Name",
  "Split",
  "Quiet",
  "Stamp",
  "Fold",
  "Wake",
  "Archive",
  "Summon",
];

const SEAL_NOUNS = [
  "the Blame",
  "a Soft Lock",
  "Thousand Extras",
  "the Nightly Gate",
  "Unmerged Rain",
  "a Paper Domain",
  "the Last Type",
  "Hollow Stars",
  "the README Oath",
  "Dead Comments",
];

export function sealName(rand: () => number) {
  return `${pick(rand, SEAL_VERBS)} ${pick(rand, SEAL_NOUNS)}`;
}

const NATURES = [
  "Aria — spoken law that rewrites a room",
  "Still Ink — a pause that becomes a wall",
  "Threadcut — one true line through chaos",
  "Chorus — power that only works with extras",
  "Hollow — strength stolen from abandoned work",
  "Stamp — a mark that cannot be reverted",
  "Nightly — power that resets at dawn",
  "Diff — sees every version of a person at once",
];

export function sealNature(rand: () => number) {
  return pick(rand, NATURES);
}

export function sealLore(rand: () => number) {
  return pick(rand, [
    "First the scouter screams. Then the air goes thin. Anyone standing in the circle hears their own unfinished work speak back.",
    "The technique does not punch. It pauses the world long enough for one correct line to exist.",
    "Summoned extras rush the field like a crowd in an opening. The hit lands because a thousand people believed it.",
    "It feeds on repos nobody opens anymore. The more you abandoned, the heavier the swing.",
    "A stamp burns into the night. Reverting it costs a memory you actually liked.",
    "At dawn the power resets — unless you were already mid-transformation when the sun came up.",
    "You see every past commit of a person stacked like ghost frames. Pick one. Make it true again.",
    "Spoken once, it rewrites the room. Spoken twice, it rewrites the speaker.",
  ]);
}
