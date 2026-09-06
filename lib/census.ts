import { houseForLanguage, type House } from "./houses";
import type { GithubRepo, GithubUser } from "./github";
import {
  chorusRole,
  epithet,
  makeName,
  openingTheme,
  sealLore,
  sealName,
  sealNature,
  seriesTitle,
  studioName,
} from "./lexicon";
import { cleanCatchphrase, seasonArcName, villageFromLocation } from "./flavor";
import { clamp, hashString, mulberry32, pick } from "./rng";

export const CENSUS_SIZE = 1000;

export type Rank = "vessel" | "rival" | "mentor" | "named" | "hollow" | "chorus";

export type Citizen = {
  id: number;
  name: string;
  epithet: string;
  role: string;
  rank: Rank;
  house: House;
  seal: { name: string; nature: string; lore: string };
  origin: string;
  story: string;
  repo?: string;
  hue: number;
};

export type CardStat = {
  key: string;
  label: string;
  value: number;
};

export type AnimeTrait = {
  name: string;
  hint: string;
};

export type PlayerCard = {
  overall: number;
  role: string;
  language: string;
  houseName: string;
  powerLevel: number;
  traits: AnimeTrait[];
  stats: CardStat[];
  stars: number;
  languages: number;
};

export type Season = {
  year: number;
  arc: string;
  episodes: { title: string; repo: string }[];
};

export type Census = {
  seed: number;
  generatedAt: string;
  user: {
    login: string;
    name: string;
    bio: string | null;
    avatar: string;
    url: string;
    location: string | null;
    createdAt: string;
    followers: number;
    publicRepos: number;
  };
  flavor: {
    village: string;
    villageNote: string;
    catchphrase: string;
    weapon: { name: string; repo: string };
  };
  seasons: Season[];
  card: PlayerCard;
  series: {
    title: string;
    studio: string;
    opening: string;
    genre: string;
    episodes: number;
    tagline: string;
    logline: string;
  };
  houses: { house: House; count: number; language: string }[];
  vessel: Citizen;
  innerCircle: Citizen[];
  hollowKing: Citizen | null;
  citizens: Citizen[];
  counts: Record<Rank, number>;
};

function yearsOnGithub(createdAt: string) {
  const ms = Date.now() - new Date(createdAt).getTime();
  return Math.max(0.2, ms / (1000 * 60 * 60 * 24 * 365));
}

function statScore(n: number, midpoint: number) {
  return clamp(Math.round(99 * (1 - Math.exp(-Math.max(0, n) / midpoint))), 12, 99);
}

function buildPlayerCard(
  user: GithubUser,
  repos: GithubRepo[],
  hollowCount: number,
  primaryLang: string | null,
  houseName: string,
): PlayerCard {
  const stars = repos.reduce((n, r) => n + r.stargazers_count, 0);
  const langs = new Set(repos.map((r) => r.language).filter(Boolean)).size;
  const years = yearsOnGithub(user.created_at);
  const aura = statScore(user.public_repos * 4 + user.followers, 80);
  const fame = statScore(stars, 40);
  const bond = statScore(user.followers, 25);
  const clan = statScore(langs, 4);
  const curse = statScore(hollowCount, 8);
  const era = statScore(years * 18, 40);
  const overall = clamp(
    Math.round(aura * 0.22 + fame * 0.18 + bond * 0.16 + clan * 0.16 + curse * 0.12 + era * 0.16),
    40,
    99,
  );
  const powerLevel =
    aura * 41 + fame * 88 + bond * 73 + clan * 52 + curse * 29 + era * 17 + user.public_repos * 19;
  const role = pickAnimeClass({ aura, fame, bond, clan, curse, era, langs, overall });
  const traits = pickTraits({
    aura,
    fame,
    bond,
    clan,
    curse,
    era,
    langs,
    repos: user.public_repos,
    stars,
    followers: user.followers,
  });
  return {
    overall,
    role,
    language: primaryLang && primaryLang !== "Unknown" ? primaryLang : "Polyglot",
    houseName,
    powerLevel,
    traits,
    stats: [
      { key: "AUR", label: "Aura", value: aura },
      { key: "KI", label: "Fame", value: fame },
      { key: "BND", label: "Bond", value: bond },
      { key: "CLN", label: "Clan", value: clan },
      { key: "CRS", label: "Curse", value: curse },
      { key: "ERA", label: "Era", value: era },
    ],
    stars,
    languages: langs,
  };
}

function pickAnimeClass(s: {
  aura: number;
  fame: number;
  bond: number;
  clan: number;
  curse: number;
  era: number;
  langs: number;
  overall: number;
}) {
  if (s.curse >= 85 && s.aura >= 70) return "Cursed Specialist";
  if (s.langs >= 6) return "Stack Hashira";
  if (s.fame < 30 && s.aura >= 70) return "Hidden Protagonist";
  if (s.bond >= 70) return "Nakama Captain";
  if (s.era >= 75 && s.overall >= 70) return "Elder Sage";
  if (s.fame >= 70) return "Idol Shinobi";
  if (s.overall >= 80) return "Final Arc Ace";
  return "Main Character";
}

function pickTraits(s: {
  aura: number;
  fame: number;
  bond: number;
  clan: number;
  curse: number;
  era: number;
  langs: number;
  repos: number;
  stars: number;
  followers: number;
}): AnimeTrait[] {
  const pool: AnimeTrait[] = [];
  if (s.langs >= 5) {
    pool.push({ name: "Multiverse Stack", hint: "Fights in six languages at once." });
  }
  if (s.curse >= 70) {
    pool.push({ name: "Domain of Dead Repos", hint: "Abandoned work still answers when called." });
  }
  if (s.aura >= 70 && s.fame < 40) {
    pool.push({ name: "Quiet Transformation", hint: "Power spikes when nobody is watching." });
  }
  if (s.repos >= 20) {
    pool.push({ name: "Side-Quest Hoarder", hint: "Every arc starts a new repo." });
  }
  if (s.followers < 20) {
    pool.push({ name: "Lone Wolf Arc", hint: "Travels without a village." });
  } else {
    pool.push({ name: "Nakama Link", hint: "Followers count as summoned spirits." });
  }
  if (s.stars < 15) {
    pool.push({ name: "Underrated Aura", hint: "The world has not scanned you yet." });
  } else {
    pool.push({ name: "Star Gravity", hint: "Repos pull people into orbit." });
  }
  if (s.era >= 60) {
    pool.push({ name: "Long Season", hint: "Still standing after filler arcs." });
  }
  pool.push({ name: "Plot Armor: Push", hint: "Can still force the ending." });
  pool.push({ name: "Scouter Breaker", hint: "Reads higher on the second scan." });
  return pool.slice(0, 4);
}

function genreFor(user: GithubUser, repos: GithubRepo[]) {
  const langs = new Set(repos.map((r) => r.language).filter(Boolean));
  const stars = repos.reduce((n, r) => n + r.stargazers_count, 0);
  const abandoned = repos.filter((r) => r.archived || isStale(r)).length;
  if (stars > 5000) return "generational battle epic";
  if (abandoned > repos.length * 0.45) return "tragic ensemble with too many ghosts";
  if (langs.size >= 8) return "multiverse workplace isekai";
  if (user.followers > 2000) return "idol shonen disguised as infrastructure";
  if (user.public_repos > 80) return "slice-of-life that secretly is a war";
  if (stars < 10 && user.public_repos > 5) return "seinen about unpaid overtime of the soul";
  return "midnight chronicle of extras who learned names";
}

function isStale(repo: GithubRepo) {
  if (!repo.pushed_at) return true;
  const age = Date.now() - new Date(repo.pushed_at).getTime();
  return age > 1000 * 60 * 60 * 24 * 400;
}

function makeSeal(rand: () => number) {
  return { name: sealName(rand), nature: sealNature(rand), lore: sealLore(rand) };
}

function originLine(rank: Rank, house: House, repo?: string) {
  if (rank === "vessel") return "The living compiler. Every other name is a remainder.";
  if (rank === "rival") return "Grew from the commit you almost didn't write.";
  if (rank === "mentor") return "Arrived with the first README and never left the shrine.";
  if (rank === "hollow") {
    return repo
      ? `Condensed from the silence after ${repo} stopped being loved.`
      : "A leftover from a branch that was deleted in anger.";
  }
  if (rank === "named" && repo) {
    return `Bound to ${repo}. If that repo dies, they become weather.`;
  }
  return `Born from stray intent in ${house.name}. They do not remember the file.`;
}

function finishCitizen(
  rand: () => number,
  base: Omit<Citizen, "seal" | "origin" | "story">,
): Citizen {
  return {
    ...base,
    seal: makeSeal(rand),
    origin: originLine(base.rank, base.house, base.repo),
    story: storyFor(rand, base.rank, base.name, base.house, base.repo),
  };
}

function storyFor(
  rand: () => number,
  rank: Rank,
  name: string,
  house: House,
  repo?: string,
) {
  const beats = {
    vessel: [
      `${name} is the only person in this anime who still has write access to reality. Everyone else is leftover ki from commits, issues, and nights that ran too long.`,
      `The village is ${house.name}. Their creed is simple: "${house.creed}" If the protagonist falls, the thousand extras become weather.`,
      `Scouters hate this one. The reading jumps when nobody is looking — typical hidden-arc behavior.`,
    ],
    rival: [
      `${name} showed up the second the protagonist almost didn't push. Same generation. Opposite ending.`,
      `They want the merge rights, not the credits. ${house.name} trained them to cut clean and never apologize.`,
      repo
        ? `Their blade is named after ${repo}. If that title trends, the rival gets a power-up mid-season.`
        : `They keep a private list of the protagonist's unfinished fights.`,
    ],
    mentor: [
      `${name} has been here since the first README. Retired from starring in other people's wars, which is mentor code for "still watching."`,
      `Tea, silence, then one sentence that ruins your whole build. ${house.name} keeps them housed because nobody else remembers the old types.`,
      `When they unsheathe an ability, it is usually to stop a student from becoming hollow.`,
    ],
    named: [
      `${name} is not a background. They are a titled elite — a living opening-credit name.`,
      repo
        ? `Bound to ${repo}. If that repository dies, they dissolve into rain and show up in flashbacks.`
        : `Bound to a project the world can still clone.`,
      `${house.name} put a crest on their back. They fight like documentation: late, precise, slightly bitter.`,
    ],
    hollow: [
      `${name} is what happens when love leaves a codebase. The smile stays. The updates do not.`,
      repo
        ? `${repo} went quiet, and this thing crawled out of the silence looking for a final boss slot.`
        : `A deleted branch learned how to stand.`,
      `Hollow ki tastes like unread issues. Do not let them say your real name.`,
    ],
    chorus: [
      `${name} was never supposed to get a close-up. Episode filler. Crowd shot. The person who points at the sky.`,
      `Then someone clicked their square. Now they have a dossier, an ability, and a grudge.`,
      `${house.name} claims them anyway. Extras keep the anime from collapsing.`,
    ],
  };
  const lines = beats[rank];
  return `${lines[0]} ${lines[1]} ${lines[2] ?? ""}`.trim();
}

function vesselStory(
  display: string,
  login: string,
  card: PlayerCard,
  house: House,
  year: number,
  repos: number,
  followers: number,
) {
  const traits = card.traits.map((t) => t.name).join(", ");
  return `${display} (@${login}) entered the story in ${year} with ${repos} public titles and ${followers} people in the stands. The scouter does not print LEAD or a football position — it prints ${card.role}, ki ${card.powerLevel.toLocaleString()}, crest of ${house.name}.

${house.creed} That is the village law. Languages on the card: ${card.language}. Stars so far: ${card.stars}. The thousand extras behind them are not decoration; they are every leftover intent that never got a close-up.

Signature traits: ${traits}. Ability hangs off the same seed as the rest of the cast, so the same GitHub name always summons the same war. If this page feels like a scan, it is. Tap the scouter again if you think the reading was low.`;
}

export function buildCensus(
  user: GithubUser,
  repos: GithubRepo[],
  extras: { catchphrase: string | null; weaponRepo: GithubRepo | null } = {
    catchphrase: null,
    weaponRepo: null,
  },
): Census {
  const seed = hashString(
    `${user.login}|${user.created_at}|${user.public_repos}|${user.followers}|${repos.length}`,
  );
  const rand = mulberry32(seed);
  const taken = new Set<string>();
  const display = user.name?.trim() || user.login;
  taken.add(display);

  const langWeight = new Map<string, number>();
  const langCount = new Map<string, number>();
  for (const repo of repos) {
    const lang = repo.language ?? "Unknown";
    langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
    langWeight.set(
      lang,
      (langWeight.get(lang) ?? 0) + repo.stargazers_count * 12 + Math.min(repo.size, 8000) + 3,
    );
  }
  const languages = [...langCount.entries()].sort((a, b) => b[1] - a[1]);
  const primaryLang =
    [...langWeight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? languages[0]?.[0] ?? null;
  const vesselHouse = houseForLanguage(primaryLang === "Unknown" ? null : primaryLang);

  const namedRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count || b.size - a.size)
    .slice(0, 18);

  const hollowRepos = [...repos]
    .filter((r) => r.archived || isStale(r) || r.open_issues_count > 20)
    .sort((a, b) => b.open_issues_count - a.open_issues_count)
    .slice(0, 12);

  const years = yearsOnGithub(user.created_at);
  const episodes = clamp(
    Math.round(user.public_repos * 1.4 + years * 6 + Math.log10(user.followers + 10) * 8),
    12,
    1000,
  );

  const vessel = finishCitizen(rand, {
    id: 1,
    name: display,
    epithet: "the Source Vessel",
    role: "protagonist — the only one who can still push to origin",
    rank: "vessel",
    house: vesselHouse,
    hue: Math.floor(rand() * 360),
  });

  const citizens: Citizen[] = [vessel];

  const rivalHouse = houseForLanguage(languages[1]?.[0] === "Unknown" ? null : languages[1]?.[0]);
  const rival = finishCitizen(rand, {
    id: 2,
    name: makeName(rand, taken, 2),
    epithet: epithet(rand),
    role: "rival — wants the merge, not the credit",
    rank: "rival",
    house: rivalHouse,
    repo: namedRepos[0]?.name,
    hue: Math.floor(rand() * 360),
  });
  citizens.push(rival);

  const mentor = finishCitizen(rand, {
    id: 3,
    name: makeName(rand, taken, 3),
    epithet: "Who Keeps the Old Types",
    role: "mentor — retired from starring other people's wars",
    rank: "mentor",
    house: vesselHouse,
    hue: Math.floor(rand() * 360),
  });
  citizens.push(mentor);

  let nextId = 4;
  for (const repo of namedRepos) {
    if (citizens.length >= 40) break;
    const house = houseForLanguage(repo.language);
    citizens.push(
      finishCitizen(rand, {
        id: nextId,
        name: makeName(rand, taken, nextId),
        epithet: epithet(rand),
        role: `named elite — living title of ${repo.name}`,
        rank: "named",
        house,
        repo: repo.name,
        hue: Math.floor(rand() * 360),
      }),
    );
    nextId += 1;
  }

  let hollowKing: Citizen | null = null;
  for (const repo of hollowRepos) {
    const house = houseForLanguage(repo.language);
    const hollow = finishCitizen(rand, {
      id: nextId,
      name: makeName(rand, taken, nextId),
      epithet: "the Unmaintained",
      role: `hollow — final boss candidate from ${repo.name}`,
      rank: "hollow",
      house,
      repo: repo.name,
      hue: Math.floor(rand() * 360),
    });
    if (!hollowKing) hollowKing = hollow;
    citizens.push(hollow);
    nextId += 1;
  }

  while (citizens.length < CENSUS_SIZE) {
    const lang = languages.length
      ? languages[Math.floor(rand() * Math.min(languages.length, 8))]![0]
      : null;
    const house = houseForLanguage(lang === "Unknown" ? null : lang);
    const id = nextId;
    const isSecretHollow = rand() < 0.04;
    const rank: Rank = isSecretHollow ? "hollow" : "chorus";
    citizens.push(
      finishCitizen(rand, {
        id,
        name: makeName(rand, taken, id),
        epithet: epithet(rand),
        role: isSecretHollow ? "hollow extra — smiles in crowd shots" : chorusRole(rand),
        rank,
        house,
        hue: Math.floor(rand() * 360),
      }),
    );
    nextId += 1;
  }

  const counts = citizens.reduce(
    (acc, c) => {
      acc[c.rank] += 1;
      return acc;
    },
    { vessel: 0, rival: 0, mentor: 0, named: 0, hollow: 0, chorus: 0 } as Record<Rank, number>,
  );

  const houses = languages.slice(0, 8).map(([language, count]) => ({
    language,
    count,
    house: houseForLanguage(language === "Unknown" ? null : language),
  }));

  const innerCircle = citizens.filter((c) => c.rank !== "chorus").slice(0, 16);
  const tagline = pick(rand, [
    "Code leaves people behind.",
    "You did not write a profile. You wrote a nation.",
    "One thousand extras. One vessel. No refunds.",
    "The README was a treaty.",
    "Abandoned repos become weather. Then they become kings.",
  ]);

  const logline = `${display} discovers that ${CENSUS_SIZE} leftover intents have been living in their GitHub since ${new Date(user.created_at).getFullYear()} — ${counts.hollow} of them are already hollow, and the rival ${rival.name} wants the merge rights.`;

  const card = buildPlayerCard(
    user,
    repos,
    counts.hollow,
    primaryLang === "Unknown" ? null : primaryLang,
    vesselHouse.name,
  );

  vessel.story = vesselStory(
    display,
    user.login,
    card,
    vesselHouse,
    new Date(user.created_at).getFullYear(),
    user.public_repos,
    user.followers,
  );
  vessel.role = `${card.role} — the only one who can still push to origin`;

  const village = villageFromLocation(user.location);
  const weaponRepo = extras.weaponRepo ?? namedRepos[0] ?? null;
  const byYear = new Map<number, GithubRepo[]>();
  for (const repo of repos) {
    const y = new Date(repo.created_at).getFullYear();
    const list = byYear.get(y) ?? [];
    list.push(repo);
    byYear.set(y, list);
  }
  const seasons = [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .slice(0, 6)
    .map(([year, yearRepos]) => ({
      year,
      arc: seasonArcName(rand, year),
      episodes: yearRepos.slice(0, 3).map((r, i) => ({
        title: `Episode ${i + 1}: ${r.name}`,
        repo: r.name,
      })),
    }));

  return {
    seed,
    generatedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: display,
      bio: user.bio,
      avatar: user.avatar_url,
      url: user.html_url,
      location: user.location,
      createdAt: user.created_at,
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    flavor: {
      village: village.name,
      villageNote: village.note,
      catchphrase: cleanCatchphrase(extras.catchphrase),
      weapon: {
        name: weaponRepo ? `Blade of ${weaponRepo.name}` : "Nameless Keyboard",
        repo: weaponRepo?.name ?? "none",
      },
    },
    seasons,
    card,
    series: {
      title: seriesTitle(rand, display),
      studio: studioName(rand),
      opening: openingTheme(rand),
      genre: genreFor(user, repos),
      episodes,
      tagline,
      logline,
    },
    houses,
    vessel,
    innerCircle,
    hollowKing,
    citizens,
    counts,
  };
}

export function spritePath(citizen: Citizen) {
  const rand = mulberry32(hashString(`${citizen.name}:${citizen.id}`));
  const cells: number[] = [];
  for (let i = 0; i < 32; i++) cells.push(rand() > 0.55 ? 1 : 0);
  return { cells, hue: citizen.hue, ink: citizen.house.ink };
}
