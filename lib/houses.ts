export type House = {
  id: string;
  name: string;
  ink: string;
  creed: string;
};

const HOUSES: Record<string, House> = {
  TypeScript: {
    id: "glass",
    name: "House of Glass Threads",
    ink: "#7ec8e3",
    creed: "Name every ghost before it compiles.",
  },
  JavaScript: {
    id: "ember",
    name: "House of Loose Fire",
    ink: "#f5c542",
    creed: "Ship first. Apologize in a patch.",
  },
  Python: {
    id: "fang",
    name: "House of the Soft Fang",
    ink: "#67d5a0",
    creed: "Indent the world until it obeys.",
  },
  Rust: {
    id: "vow",
    name: "House of Iron Vow",
    ink: "#e07a3d",
    creed: "If it is unsafe, it is unfinished.",
  },
  Go: {
    id: "blade",
    name: "House of Short Blades",
    ink: "#6ec6d9",
    creed: "One tool. One cut. No ceremony.",
  },
  Java: {
    id: "cathedral",
    name: "House of the Long Cathedral",
    ink: "#f0b37a",
    creed: "Build the temple before the prayer.",
  },
  Kotlin: {
    id: "night",
    name: "House of Night Sugar",
    ink: "#c9a0ff",
    creed: "Sweetness is still a weapon.",
  },
  Swift: {
    id: "falcon",
    name: "House of the Glass Falcon",
    ink: "#ff8a65",
    creed: "Fall fast. Land prettier.",
  },
  C: {
    id: "bone",
    name: "House of Bare Bone",
    ink: "#cfd8dc",
    creed: "Memory is a beast you feed by hand.",
  },
  "C++": {
    id: "hydra",
    name: "House of the Twelve-Headed Spec",
    ink: "#90caf9",
    creed: "Power with a thousand footnotes.",
  },
  "C#": {
    id: "mirror",
    name: "House of Corporate Mirrors",
    ink: "#b39ddb",
    creed: "Reflection is a kind of magic.",
  },
  Ruby: {
    id: "gem",
    name: "House of Warm Gems",
    ink: "#ef9a9a",
    creed: "Make it kind, then make it fast.",
  },
  PHP: {
    id: "tide",
    name: "House of the Old Tide",
    ink: "#ce93d8",
    creed: "The ocean still runs the ports.",
  },
  HTML: {
    id: "frame",
    name: "House of Paper Frames",
    ink: "#ffab91",
    creed: "Structure is already a story.",
  },
  CSS: {
    id: "veil",
    name: "House of Painted Veils",
    ink: "#80deea",
    creed: "Beauty is a layout that holds.",
  },
  Shell: {
    id: "pipe",
    name: "House of Hidden Pipes",
    ink: "#a5d6a7",
    creed: "The quiet ones move the city.",
  },
  Dart: {
    id: "flutter",
    name: "House of Twin Wings",
    ink: "#80cbc4",
    creed: "One codebase, two skies.",
  },
  Scala: {
    id: "fold",
    name: "House of Infinite Folds",
    ink: "#ef9a9a",
    creed: "Every problem is a smaller problem wearing a coat.",
  },
  Haskell: {
    id: "pure",
    name: "House of the Closed Garden",
    ink: "#b39ddb",
    creed: "Side effects are trespassers.",
  },
  Elixir: {
    id: "phoenix",
    name: "House of the Supervised Flame",
    ink: "#ce93d8",
    creed: "Let it crash. Let it return.",
  },
  Lua: {
    id: "moon",
    name: "House of Pocket Moons",
    ink: "#90caf9",
    creed: "Small gods in small machines.",
  },
  Zig: {
    id: "tooth",
    name: "House of Explicit Teeth",
    ink: "#ffe082",
    creed: "No hidden allocations. No hidden kings.",
  },
  Nim: {
    id: "silk",
    name: "House of Compiled Silk",
    ink: "#fff59d",
    creed: "Look gentle. Hit native.",
  },
  Vue: {
    id: "leaf",
    name: "House of Single Leaves",
    ink: "#81c784",
    creed: "One file can still be a forest.",
  },
  Dockerfile: {
    id: "box",
    name: "House of Nested Boxes",
    ink: "#4fc3f7",
    creed: "Ship the whole room, not the furniture.",
  },
  Markdown: {
    id: "chronicle",
    name: "House of the Quiet Chronicle",
    ink: "#b0bec5",
    creed: "If it is not written, it did not happen.",
  },
};

export const UNCOMPILED: House = {
  id: "uncompiled",
  name: "House of the Uncompiled",
  ink: "#d4c4a8",
  creed: "We exist in comments and almosts.",
};

export function houseForLanguage(language: string | null | undefined): House {
  if (!language) return UNCOMPILED;
  return HOUSES[language] ?? {
    id: language.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: `House of ${language}`,
    ink: "#e0c3a0",
    creed: "A new dialect of the old war.",
  };
}
