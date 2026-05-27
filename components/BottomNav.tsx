"use client";

import Link from "next/link";
import { LEVELS_PER_WORLD, type World } from "@/lib/types";

interface Props {
  world: World;
  currentLevel: number | "random";
  completedLevels?: number[];
}

export default function BottomNav({ world, currentLevel, completedLevels = [] }: Props) {
  const completedSet = new Set(completedLevels);
  const accent = world === "tron" ? "var(--cyan)" : "var(--gold)";
  const accentSoft =
    world === "tron" ? "rgba(0, 229, 255, 0.18)" : "rgba(255, 198, 58, 0.22)";

  return (
    <div
      className="flex items-center gap-2 px-3 py-3 border-t"
      style={{ borderColor: accentSoft, background: "rgba(0,0,0,0.35)" }}
    >
      <Link
        href="/"
        className="shrink-0 rounded-full px-3 py-1.5 text-xs"
        style={{ background: "rgba(255,255,255,0.06)", color: "var(--fg)" }}
      >
        ← World
      </Link>

      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 min-w-max">
          {Array.from({ length: LEVELS_PER_WORLD }, (_, i) => i + 1).map((lv) => {
            const active = lv === currentLevel;
            const cleared = completedSet.has(lv);
            return (
              <Link
                key={lv}
                href={`/play/${world}/${lv}`}
                className="relative rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums"
                style={{
                  background: active ? accent : cleared ? accentSoft : "rgba(255,255,255,0.06)",
                  color: active ? "#000" : cleared ? accent : "var(--fg)",
                  border: `1px solid ${active ? accent : cleared ? accent : "transparent"}`,
                }}
              >
                {lv}
                {cleared && !active ? (
                  <span
                    className="absolute -top-1 -right-1 text-[8px] leading-none rounded-full px-1 py-[1px]"
                    style={{ background: accent, color: "#000" }}
                  >
                    ✓
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        href={`/play/${world}/random`}
        className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
        style={{
          background: currentLevel === "random" ? accent : accentSoft,
          color: currentLevel === "random" ? "#000" : accent,
          border: `1px solid ${accent}`,
        }}
      >
        Random
      </Link>
    </div>
  );
}
