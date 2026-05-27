"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LEVELS_PER_WORLD } from "@/lib/types";

interface Props {
  playerName: string;
  level: number | "random";
  onPlayAgain: () => void;
}

export default function HoneyVictory({ playerName, level, onPlayAgain }: Props) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 45 }).map(() => ({
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 40,
        dur: 2.4 + Math.random() * 2.4,
        delay: Math.random() * 0.6,
      })),
    [],
  );

  const drips = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        left: 25 + Math.random() * 50,
        len: 14 + Math.random() * 18,
        delay: 0.15 + Math.random() * 0.4,
      })),
    [],
  );

  const nextLevel =
    typeof level === "number" && level < LEVELS_PER_WORLD ? level + 1 : null;

  return (
    <div className="world-honey honey-comb-bg relative h-dvh overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${b.left}%`,
              ["--dx" as string]: `${b.dx}vw`,
              ["--dur" as string]: `${b.dur}s`,
              animationDelay: `${b.delay}s`,
              background: i % 3 === 0 ? "#ffe9a8" : "#ffc63a",
              borderRadius: "50% 50% 40% 40%",
              boxShadow: "0 0 10px rgba(255, 198, 58, 0.55)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <h1 className="honey-text text-7xl font-extrabold tracking-tight">
          Sweet!
        </h1>
        <div className="relative h-8 mt-1 flex justify-center">
          {drips.map((d, i) => (
            <span
              key={i}
              className="drip"
              style={{
                left: `${d.left}%`,
                ["--len" as string]: `${d.len}px`,
                ["--delay" as string]: `${d.delay}s`,
              }}
            />
          ))}
        </div>
        <p className="mt-6 text-sm" style={{ color: "rgba(255, 198, 58, 0.85)" }}>
          Nicely done, {playerName}.
        </p>
      </div>

      <Bee />

      <div className="relative z-10 mt-10 flex flex-col gap-3 w-full max-w-xs">
        {nextLevel ? (
          <Link
            href={`/play/honey/${nextLevel}`}
            className="rounded-full px-6 py-3 text-center text-base font-semibold"
            style={{
              background: "var(--gold)",
              color: "#2b1700",
              boxShadow: "0 0 24px rgba(255, 198, 58, 0.5)",
            }}
          >
            Next level →
          </Link>
        ) : (
          <button
            onClick={onPlayAgain}
            className="rounded-full px-6 py-3 text-base font-semibold"
            style={{
              background: "var(--gold)",
              color: "#2b1700",
              boxShadow: "0 0 24px rgba(255, 198, 58, 0.5)",
            }}
          >
            {level === "random" ? "New swarm" : "Replay"}
          </button>
        )}
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-center text-sm"
          style={{
            border: "1px solid rgba(255, 198, 58, 0.5)",
            color: "var(--gold)",
          }}
        >
          World select
        </Link>
      </div>
    </div>
  );
}

function Bee() {
  return (
    <svg
      className="absolute opacity-80"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      style={{ bottom: "12%", right: "8%" }}
      aria-hidden
    >
      <ellipse cx="32" cy="34" rx="18" ry="13" fill="#ffc63a" />
      <rect x="22" y="24" width="4" height="20" fill="#1a0e05" />
      <rect x="30" y="22" width="4" height="24" fill="#1a0e05" />
      <rect x="38" y="24" width="4" height="20" fill="#1a0e05" />
      <ellipse cx="22" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.45)" />
      <ellipse cx="42" cy="22" rx="8" ry="5" fill="rgba(255,255,255,0.45)" />
      <circle cx="48" cy="36" r="3" fill="#1a0e05" />
    </svg>
  );
}
