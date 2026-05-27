"use client";

import { useEffect, useMemo, useState } from "react";
import BottomNav from "./BottomNav";
import HoneyVictory from "./HoneyVictory";
import { HEX_VIEW_H, HEX_VIEW_W, hexCenter, hexPoints } from "@/lib/hex";
import { isHexSolved, tapHexCell } from "@/lib/puzzle-hex";
import { playHoneyDrop } from "@/lib/sfx";
import type { HexPuzzle } from "@/lib/types";

interface Props {
  puzzle: HexPuzzle;
  level: number | "random";
  playerName: string;
  reshuffleRandom?: () => HexPuzzle;
}

interface HoneyBurst {
  key: number;
  x: number;
  y: number;
  drops: Array<{ dx: number; dy: number; r: number; dur: number; delay: number }>;
}

export default function HoneyBoard({ puzzle: initial, level, playerName, reshuffleRandom }: Props) {
  const [puzzle, setPuzzle] = useState<HexPuzzle>(initial);
  const [tapsRemaining, setTapsRemaining] = useState(initial.targetTaps);
  const [flippedKey, setFlippedKey] = useState(0);
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set());
  const [bursts, setBursts] = useState<HoneyBurst[]>([]);
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
    if (tapsRemaining <= 1) return "#ffe9a8";
    return "var(--gold)";
  }, [tapsRemaining]);

  function handleTap(slotIndex: number) {
    if (victory) return;
    const cell = puzzle.cells[slotIndex];
    if (!cell.active) return;

    playHoneyDrop();
    const { cells: next, flipped } = tapHexCell(puzzle.cells, slotIndex);
    const nextPuzzle: HexPuzzle = { ...puzzle, cells: next };
    const remaining = tapsRemaining - 1;
    setPuzzle(nextPuzzle);
    setTapsRemaining(remaining);
    setFlippedKey((k) => k + 1);
    setFlippedSet(new Set(flipped));

    const { x, y } = hexCenter(cell.row, cell.col);
    const drops = Array.from({ length: 6 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 0.5 + Math.random() * 0.8;
      return {
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist + 0.6,
        r: 0.07 + Math.random() * 0.07,
        dur: 700 + Math.random() * 400,
        delay: Math.random() * 100,
      };
    });
    const burstKey = Date.now() + Math.random();
    setBursts((b) => [...b, { key: burstKey, x, y, drops }]);
    window.setTimeout(() => {
      setBursts((b) => b.filter((bu) => bu.key !== burstKey));
    }, 1200);

    if (isHexSolved(next) && remaining === 0) {
      window.setTimeout(() => setVictory(true), 460);
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
      <HoneyVictory
        playerName={playerName}
        level={level}
        onPlayAgain={handleReset}
      />
    );
  }

  return (
    <div className="world-honey h-dvh flex flex-col">
      <div className="honey-comb-bg flex-1 flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs uppercase tracking-widest honey-text">
              {level === "random" ? "Wild swarm" : `Level ${level}`}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "rgba(255, 198, 58, 0.6)" }}>
              Turn every hex gold
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Taps left
            </div>
            <div className="text-4xl font-extrabold tabular-nums" style={{ color: counterColor, textShadow: "0 0 10px rgba(255, 198, 58, 0.5)" }}>
              {tapsRemaining}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center px-4">
          <svg
            viewBox={`-0.2 -0.2 ${HEX_VIEW_W + 0.4} ${HEX_VIEW_H + 0.4}`}
            className="w-full h-full"
            style={{
              maxHeight: "100%",
              maxWidth: `min(92vw, ${(HEX_VIEW_W / HEX_VIEW_H) * 100}%)`,
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="honey-green" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#fff2c2" />
                <stop offset="55%" stopColor="#ffc63a" />
                <stop offset="100%" stopColor="#7a4708" />
              </radialGradient>
              <radialGradient id="honey-red" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#c66989" />
                <stop offset="55%" stopColor="#6b2347" />
                <stop offset="100%" stopColor="#2a0a18" />
              </radialGradient>
            </defs>

            {puzzle.cells.map((c) => {
              if (!c.active) {
                return <polygon key={c.index} points={hexPoints(c.row, c.col)} className="hex-inactive-honey" />;
              }
              const fill = c.color === "green" ? "url(#honey-green)" : "url(#honey-red)";
              const flipping = flippedSet.has(c.index);
              return (
                <polygon
                  key={`${c.index}-${flippedKey}-${flipping ? "f" : "s"}`}
                  points={hexPoints(c.row, c.col)}
                  className={`hex-stroke-honey ${flipping ? "hex-flip" : ""}`}
                  fill={fill}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTap(c.index)}
                />
              );
            })}

            {bursts.map((b) => (
              <g key={b.key}>
                {b.drops.map((d, i) => (
                  <circle
                    key={i}
                    cx={b.x}
                    cy={b.y}
                    r={d.r}
                    className="honey-drop"
                    style={{
                      ["--dx" as string]: `${d.dx}`,
                      ["--dy" as string]: `${d.dy}`,
                      ["--dur" as string]: `${d.dur}ms`,
                      animationDelay: `${d.delay}ms`,
                    }}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-center pb-3">
          <button
            onClick={handleReset}
            className="rounded-full px-4 py-1.5 text-xs"
            style={{
              background: "rgba(255, 198, 58, 0.10)",
              border: "1px solid rgba(255, 198, 58, 0.45)",
              color: "var(--gold)",
            }}
          >
            {level === "random" ? "New swarm" : "Reset"}
          </button>
        </div>
      </div>

      <BottomNav world="honey" currentLevel={level} />
    </div>
  );
}
