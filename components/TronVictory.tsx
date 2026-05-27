"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LEVELS_PER_WORLD } from "@/lib/types";

interface Props {
  playerName: string;
  level: number | "random";
  onPlayAgain: () => void;
}

export default function TronVictory({ playerName, level, onPlayAgain }: Props) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 60,
        dur: 1.6 + Math.random() * 1.8,
        delay: Math.random() * 0.5,
        color: i % 2 === 0 ? "#00e5ff" : "#ff2bd6",
      })),
    [],
  );

  const scanLines = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({
        delay: i * 0.3,
        dur: 1.4 + i * 0.2,
      })),
    [],
  );

  const nextLevel =
    typeof level === "number" && level < LEVELS_PER_WORLD ? level + 1 : null;

  return (
    <div className="world-tron tron-grid-bg relative h-screen overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0">
        {scanLines.map((s, i) => (
          <div
            key={i}
            className="scan-line"
            style={{
              ["--dur" as string]: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {sparks.map((c, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              ["--dx" as string]: `${c.dx}vw`,
              ["--dur" as string]: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
              background: c.color,
              boxShadow: `0 0 8px ${c.color}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <h1 className="tron-text tron-glitch text-6xl font-extrabold tracking-tighter">
          VICTORY
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--cyan)" }}>
          Grid cleared, {playerName}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col gap-3 w-full max-w-xs">
        {nextLevel ? (
          <Link
            href={`/play/tron/${nextLevel}`}
            className="rounded-full px-6 py-3 text-center text-base font-semibold"
            style={{
              background: "var(--cyan)",
              color: "#001016",
              boxShadow: "0 0 24px rgba(0, 229, 255, 0.5)",
            }}
          >
            Next level →
          </Link>
        ) : (
          <button
            onClick={onPlayAgain}
            className="rounded-full px-6 py-3 text-base font-semibold"
            style={{
              background: "var(--cyan)",
              color: "#001016",
              boxShadow: "0 0 24px rgba(0, 229, 255, 0.5)",
            }}
          >
            {level === "random" ? "New random" : "Replay"}
          </button>
        )}
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-center text-sm"
          style={{
            border: "1px solid rgba(0, 229, 255, 0.5)",
            color: "var(--cyan)",
          }}
        >
          World select
        </Link>
      </div>
    </div>
  );
}
