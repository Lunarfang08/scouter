let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  return ctx;
}

function beep(frequency: number, at: number, dur = 0.07, gain = 0.05) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.value = frequency;
  g.gain.value = gain;
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + at);
  o.stop(c.currentTime + at + dur);
}

export function playScouterScan(over9000: boolean) {
  try {
    const c = audio();
    if (!c) return;
    void c.resume();
    for (let i = 0; i < 8; i++) beep(880 + i * 40, i * 0.09, 0.06, 0.04);
    if (over9000) {
      beep(220, 0.85, 0.35, 0.08);
      beep(440, 1.05, 0.4, 0.07);
      beep(880, 1.2, 0.5, 0.06);
    } else {
      beep(1320, 0.85, 0.18, 0.06);
    }
  } catch {
    /* autoplay blocked until a click — rescan still works */
  }
}
