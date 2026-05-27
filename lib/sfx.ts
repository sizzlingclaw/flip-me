"use client";

let ctx: AudioContext | null = null;
let unlocked = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

function unlockContext(c: AudioContext) {
  if (c.state === "suspended") {
    void c.resume();
  }
  if (unlocked) return;
  try {
    const buf = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    src.start(0);
  } catch {
    // ignore
  }
  unlocked = true;
}

export function playTronZap() {
  const c = getCtx();
  if (!c) return;
  unlockContext(c);
  const now = c.currentTime + 0.001;
  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}

export function playHoneyDrop() {
  const c = getCtx();
  if (!c) return;
  unlockContext(c);
  const now = c.currentTime + 0.001;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.45, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.32);
}
