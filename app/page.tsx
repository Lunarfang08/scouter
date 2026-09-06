import { SearchForm } from "@/components/SearchForm";
import { PairForm } from "@/components/PairForm";
import Link from "next/link";

const CREATOR = {
  login: "Lunarfang08",
  name: "Arsal Adnan",
  github: "https://github.com/Lunarfang08",
  avatar: "https://github.com/Lunarfang08.png",
};

const DEMOS = [CREATOR.login, "torvalds", "gaearon", "sindresorhus"];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-sm tracking-[0.32em] uppercase text-white/90">
          Scouter
        </Link>
        <a
          href={CREATOR.github}
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest text-white/50 hover:text-lime-300"
        >
          @{CREATOR.login}
        </a>
      </header>

      <section className="grid items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:px-10 md:pt-14">
        <div>
          <p className="font-[family-name:var(--font-lcd)] text-xs tracking-[0.28em] text-lime-400">
            POWER READING · GITHUB
          </p>
          <h1 className="mt-4 max-w-xl text-5xl leading-[0.95] text-white md:text-7xl">
            Scan a GitHub. Unlock the anime.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/65">
            Scouter reads a public profile and builds a holographic card: your real name, a ki
            reading that counts up, a class, anime traits, and a nation of 1,000 extras hiding in
            old repos. Same username always summons the same cast.
          </p>
          <div className="mt-8">
            <SearchForm />
          </div>
          <p className="mt-3 text-sm text-white/40">Paste a username or the full github.com link.</p>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-white/40">
            try{" "}
            {DEMOS.map((d, i) => (
              <span key={d}>
                <Link className="text-cyan-300 underline decoration-white/20 hover:text-white" href={`/c/${d}`}>
                  {d}
                </Link>
                {i < DEMOS.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>

        <Link href={`/c/${CREATOR.login}`} className="group relative block">
          <div className="absolute -inset-6 rounded-[40px] bg-lime-400/10 blur-3xl transition group-hover:bg-lime-400/20" />
          <div className="relative overflow-hidden rounded-[32px] border border-lime-400/30 bg-black/60 p-6 shadow-[0_0_80px_rgba(163,255,58,0.12)]">
            <p className="font-[family-name:var(--font-lcd)] text-xs tracking-[0.3em] text-lime-400">
              FEATURED SCAN
            </p>
            <div className="mt-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CREATOR.avatar}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <p className="text-2xl text-white">{CREATOR.name}</p>
                <p className="font-[family-name:var(--font-mono)] text-sm text-white/50">
                  @{CREATOR.login}
                </p>
              </div>
            </div>
            <p className="mt-6 font-[family-name:var(--font-lcd)] text-[11px] tracking-[0.25em] text-lime-600">
              KI READING
            </p>
            <p className="font-[family-name:var(--font-lcd)] text-5xl text-lime-300 [text-shadow:0_0_18px_#b7ff3c]">
              OPEN SCOUTER
            </p>
            <p className="mt-3 text-sm text-white/45">
              Built by {CREATOR.name}. Tap to see the live card, traits, and the other 999.
            </p>
          </div>
        </Link>
      </section>

      <section className="grid gap-px border-y border-white/10 bg-white/10 md:grid-cols-3">
        {[
          {
            n: "01",
            t: "Power scouter",
            d: "A green ki reading that counts up from your public activity. Tap it to scan again. Some readings break 9000.",
          },
          {
            n: "02",
            t: "Holographic card",
            d: "Your photo, real name, class, and house. Tilt with the mouse. Flip it for anime traits like Domain of Dead Repos.",
          },
          {
            n: "03",
            t: "1,000 extras",
            d: "Languages become clans. Named elites come from repos. Abandoned projects go hollow. Click any square for a full dossier.",
          },
        ].map((item) => (
          <article key={item.n} className="bg-[#07080f] px-6 py-10 md:px-10">
            <p className="font-[family-name:var(--font-lcd)] text-xs text-lime-500">{item.n}</p>
            <h2 className="mt-2 text-2xl text-white">{item.t}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">{item.d}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 px-6 py-16 md:grid-cols-2 md:px-10">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl text-white">Duel</h2>
          <p className="mt-2 text-sm text-white/50">Two scouters race. Highest ki wins.</p>
          <div className="mt-6">
            <PairForm mode="duel" />
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl text-white">Fusion</h2>
          <p className="mt-2 text-sm text-white/50">Smash two profiles into one overcharged form.</p>
          <div className="mt-6">
            <PairForm mode="fuse" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <h2 className="text-3xl text-white md:text-4xl">How a scan works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Drop a GitHub",
              d: "Username or URL. Scouter pulls public repos, languages, stars, and account age.",
            },
            {
              t: "Ki gets locked",
              d: "You receive a class (not a football position), six readings, and traits from how you actually ship.",
            },
            {
              t: "Share the card",
              d: "Copy the link, download the image, or drop it in a README. The cast stays the same next time.",
            },
          ].map((step, i) => (
            <li key={step.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-[family-name:var(--font-lcd)] text-lime-400">0{i + 1}</p>
              <h3 className="mt-2 text-xl text-white">{step.t}</h3>
              <p className="mt-2 text-sm text-white/55">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-6 mb-16 rounded-[32px] border border-white/10 bg-white/5 p-8 md:mx-10 md:flex md:items-center md:justify-between md:p-12">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CREATOR.avatar} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-sm text-white/40">Made by</p>
            <p className="text-2xl text-white">{CREATOR.name}</p>
            <a href={CREATOR.github} className="font-[family-name:var(--font-mono)] text-sm text-cyan-300">
              github.com/{CREATOR.login}
            </a>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
          <Link
            href={`/c/${CREATOR.login}`}
            className="rounded-full bg-[#b7ff3c] px-5 py-3 text-sm font-semibold text-black"
          >
            Scan {CREATOR.login}
          </Link>
          <a
            href={CREATOR.github}
            className="rounded-full border border-white/20 px-5 py-3 text-sm text-white/80"
          >
            GitHub profile
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-white/35 md:px-10">
        Scouter · public GitHub only · same name, same thousand extras
      </footer>
    </main>
  );
}
