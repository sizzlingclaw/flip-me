"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import TronVictory from "./TronVictory";
import { trianglePoints, VIEW_H, VIEW_W, triangleCentroid } from "@/lib/grid";
import { isSolved, tapSlot } from "@/lib/puzzle";
import { playTronZap } from "@/lib/sfx";
import type { TrianglePuzzle } from "@/lib/types";

interface Props {
  puzzle: TrianglePuzzle;
  level: number | "random";
  playerName: string;
  reshuffleRandom?: () => TrianglePuzzle;
}

interface ZapBurst {
  key: number;
  x: number;
  y: number;
}

export default function TronBoard({ puzzle: initial, level, playerName, reshuffleRandom }: Props) {
  const [puzzle, setPuzzle] = useState<TrianglePuzzle>(initial);
  const [tapsRemaining, setTapsRemaining] = useState(initial.targetTaps);
  const [flippedKey, setFlippedKey] = useState(0);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [bursts, setBursts] = useState<ZapBurst[]>([]);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    setPuzzle(initial);
    setTapsRemaining(initial.targetTaps);
    setFlippedSet(new Set());
    setBursts([]);
    setVictory(false);
  }, [initial]);

  const counterColor = useMemo(() => {
    if (tapsRemaining < 0) return "var(--red)";
    if (tapsRemaining <= 1) return "var(--magenta)";
    return "var(--cyan)";
  }, [tapsRemaining]);

  function handleTap(slotIndex: number) {
    if (victory) return;
    const slot = puzzle.slots[slotIndex];
    if (!slot.active) return;

    playTronZap();
    const { slots: next, flipped } = tapSlot(puzzle.slots, slotIndex);
    const nextPuzzle: TrianglePuzzle = { ...puzzle, slots: next };
    const remaining = tapsRemaining - 1;
    setPuzzle(nextPuzzle);
    setTapsRemaining(remaining);
    setFlippedKey((k) => k + 1);
    setFlippedSet(new Set(flipped));

    const { x, y } = triangleCentroid(slot.row, slot.col);
    const burstKey = Date.now() + Math.random();
    setBursts((b) => [...b, { key: burstKey, x, y }]);
    window.setTimeout(() => {
      setBursts((b) => b.filter((bu) => bu.key !== burstKey));
    }, 450);

    if (isSolved(next) && remaining === 0) {
      window.setTimeout(() => setVictory(true), 380);
    }
  }

  function handleReset() {
    if (level === "random" && reshuffleRandom) {
      const p = reshuffleRandom();
      setPuzzle(p);
      setTapsRemaining(p.targetTaps);
    } else {
      setPuzzle(initial);
      setTapsRemaining(initial.targetTaps);
    }
    setFlippedSet(new Set());
    setBursts([]);
    setVictory(false);
  }

  if (victory) {
    return (
      <TronVictory
        playerName={playerName}
        level={level}
        onPlayAgain={handleReset}
      />
    );
  }

  return (
    <div className="world-tron h-dvh flex flex-col">
      <div className="tron-grid-bg flex-1 flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
              {level === "random" ? "Random run" : `Level ${level}`}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(0, 229, 255, 0.55)" }}>
              Turn every triangle cyan
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Taps left
            </div>
            <div className="text-4xl font-extrabold tabular-nums tron-text" style={{ color: counterColor }}>
              {tapsRemaining}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-4">
          <svg
            viewBox={`-0.15 -0.15 ${VIEW_W + 0.3} ${VIEW_H + 0.3}`}
            className="w-full h-full"
            style={{
              maxHeight: "100%",
              maxWidth: `min(92vw, ${(VIEW_W / VIEW_H) * 100}%)`,
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tron-green" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7df9ff" />
                <stop offset="60%" stopColor="#00b6c8" />
                <stop offset="100%" stopColor="#005a66" />
              </linearGradient>
              <linearGradient id="tron-red" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff8be8" />
                <stop offset="60%" stopColor="#d61aab" />
                <stop offset="100%" stopColor="#6b1058" />
              </linearGradient>
            </defs>

            {puzzle.slots.map((s) => {
              if (!s.active) {
                return <polygon key={s.index} points={trianglePoints(s.row, s.col)} className="tri-inactive-tron" />;
              }
              const fill = s.color === "green" ? "url(#tron-green)" : "url(#tron-red)";
              const flipping = flippedSet.has(s.index);
              return (
                <polygon
                  key={`${s.index}-${flippedKey}-${flipping ? "f" : "s"}`}
                  points={trianglePoints(s.row, s.col)}
                  className={`tri-stroke-tron ${flipping ? "tri-flip" : ""}`}
                  fill={fill}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTap(s.index)}
                />
              );
            })}

            {bursts.map((b) => (
              <ZapRays key={b.key} cx={b.x} cy={b.y} />
            ))}
          </svg>
        </div>

        <div className="flex justify-center pb-3">
          <button
            onClick={handleReset}
            className="rounded-full px-4 py-1.5 text-xs"
            style={{
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              color: "var(--cyan)",
            }}
          >
            {level === "random" ? "New random" : "Reset"}
          </button>
        </div>
      </div>

      <BottomNav world="tron" currentLevel={level} />
    </div>
  );
}

function ZapRays({ cx, cy }: { cx: number; cy: number }) {
  const rays = 6;
  const length = 0.7;
  return (
    <g>
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * Math.PI * 2 + Math.PI / 12;
        const x2 = cx + Math.cos(angle) * length;
        const y2 = cy + Math.sin(angle) * length;
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} className="zap-ray" />;
      })}
    </g>
  );
}
