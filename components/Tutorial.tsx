"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trianglePoints, VIEW_H, VIEW_W } from "@/lib/grid";
import { generatePuzzle, isSolved, tapSlot } from "@/lib/puzzle";
import { TUTORIAL_MASK_DIAMOND, TUTORIAL_MASK_ROW, TUTORIAL_MASK_SINGLE } from "@/lib/masks";
import type { TrianglePuzzle } from "@/lib/types";

interface Step {
  instruction: string;
  build: () => TrianglePuzzle;
}

const STEPS: Step[] = [
  {
    instruction: "Tap the triangle to flip it green.",
    build: () => generatePuzzle(Math.random, { mask: TUTORIAL_MASK_SINGLE, targetTaps: 1 }),
  },
  {
    instruction: "One tap flips its neighbors too. Find the winning tap.",
    build: () => generatePuzzle(Math.random, { mask: TUTORIAL_MASK_ROW, targetTaps: 1 }),
  },
  {
    instruction: "Plan your taps. The counter must hit zero exactly.",
    build: () => generatePuzzle(Math.random, { mask: TUTORIAL_MASK_DIAMOND, targetTaps: 2 }),
  },
];

export default function Tutorial() {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const [puzzle, setPuzzle] = useState<TrianglePuzzle>(() => step.build());
  const [tapsRemaining, setTapsRemaining] = useState(puzzle.targetTaps);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fresh = STEPS[stepIdx].build();
    setPuzzle(fresh);
    setTapsRemaining(fresh.targetTaps);
    setDone(false);
  }, [stepIdx]);

  const counterColor = useMemo(() => {
    if (tapsRemaining < 0) return "var(--red)";
    if (tapsRemaining === 0) return "var(--cyan)";
    return "var(--fg)";
  }, [tapsRemaining]);

  function handleTap(slotIndex: number) {
    if (done) return;
    const slot = puzzle.slots[slotIndex];
    if (!slot.active) return;
    const { slots: next } = tapSlot(puzzle.slots, slotIndex);
    const remaining = tapsRemaining - 1;
    setPuzzle({ ...puzzle, slots: next });
    setTapsRemaining(remaining);
    if (isSolved(next) && remaining === 0) {
      setDone(true);
    }
  }

  function handleReset() {
    const fresh = STEPS[stepIdx].build();
    setPuzzle(fresh);
    setTapsRemaining(fresh.targetTaps);
    setDone(false);
  }

  function next() {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    }
  }

  const isLast = stepIdx === STEPS.length - 1;

  return (
    <div className="world-tron tron-grid-bg h-screen flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5">
        <Link href="/" className="text-sm" style={{ color: "var(--muted)" }}>
          ← Skip
        </Link>
        <div className="text-xs uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
          Tutorial {stepIdx + 1}/{STEPS.length}
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Taps left
          </div>
          <div className="text-2xl font-extrabold tabular-nums" style={{ color: counterColor }}>
            {tapsRemaining}
          </div>
        </div>
      </div>

      <div className="px-6 mt-4 text-center">
        <p className="text-base" style={{ color: "var(--fg)" }}>
          {step.instruction}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <svg
          viewBox={`-0.15 -0.15 ${VIEW_W + 0.3} ${VIEW_H + 0.3}`}
          className="w-full"
          style={{
            maxHeight: "55vh",
            maxWidth: `min(90vw, ${(VIEW_W / VIEW_H) * 55}vh)`,
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="tut-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7df9ff" />
              <stop offset="60%" stopColor="#00b6c8" />
              <stop offset="100%" stopColor="#005a66" />
            </linearGradient>
            <linearGradient id="tut-red" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8be8" />
              <stop offset="60%" stopColor="#d61aab" />
              <stop offset="100%" stopColor="#6b1058" />
            </linearGradient>
          </defs>
          {puzzle.slots.map((s) => {
            if (!s.active) {
              return <polygon key={s.index} points={trianglePoints(s.row, s.col)} className="tri-inactive-tron" />;
            }
            const fill = s.color === "green" ? "url(#tut-green)" : "url(#tut-red)";
            return (
              <polygon
                key={s.index}
                points={trianglePoints(s.row, s.col)}
                className="tri-stroke-tron"
                fill={fill}
                style={{ cursor: "pointer" }}
                onClick={() => handleTap(s.index)}
              />
            );
          })}
        </svg>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-3 items-center">
        {done ? (
          isLast ? (
            <Link
              href="/"
              className="rounded-full px-6 py-3 text-base font-semibold"
              style={{ background: "var(--cyan)", color: "#001016" }}
            >
              Done — pick a world
            </Link>
          ) : (
            <button
              onClick={next}
              className="rounded-full px-6 py-3 text-base font-semibold"
              style={{ background: "var(--cyan)", color: "#001016" }}
            >
              Next step →
            </button>
          )
        ) : (
          <button
            onClick={handleReset}
            className="rounded-full px-4 py-1.5 text-xs"
            style={{
              background: "rgba(0, 229, 255, 0.08)",
              border: "1px solid rgba(0, 229, 255, 0.4)",
              color: "var(--cyan)",
            }}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
