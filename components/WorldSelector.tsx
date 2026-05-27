import Link from "next/link";
import { LEVELS_PER_WORLD } from "@/lib/types";

interface Props {
  name: string;
  tronCleared: number;
  honeyCleared: number;
}

export default function WorldSelector({ name, tronCleared, honeyCleared }: Props) {
  return (
    <div className="relative h-dvh flex flex-col items-center justify-center px-6 gap-8">
      <Link
        href="/tutorial"
        className="absolute top-4 right-4 text-sm underline"
        style={{ color: "var(--muted)" }}
      >
        Tutorial
      </Link>

      <div className="text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Welcome
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight" style={{ color: "var(--fg)" }}>
          {name}
        </h1>
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Pick your world.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Link
          href="/play/tron/1"
          className="rounded-2xl p-5 transition active:scale-[0.98] world-tron tron-grid-bg block"
          style={{ border: "1px solid rgba(0, 229, 255, 0.45)" }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold tron-text">Flip it Tron</span>
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
              Triangles
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xs" style={{ color: "rgba(0, 229, 255, 0.7)" }}>
              Neon grid. Electric flips.
            </p>
            <p className="text-xs tabular-nums" style={{ color: "var(--cyan)" }}>
              {tronCleared}/{LEVELS_PER_WORLD} cleared
            </p>
          </div>
        </Link>

        <Link
          href="/play/honey/1"
          className="rounded-2xl p-5 transition active:scale-[0.98] world-honey honey-comb-bg block"
          style={{ border: "1px solid rgba(255, 198, 58, 0.45)" }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold honey-text">Flip it Honey</span>
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--gold)" }}>
              Hexagons
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xs" style={{ color: "rgba(255, 198, 58, 0.7)" }}>
              Sweet combs. Sticky drops.
            </p>
            <p className="text-xs tabular-nums" style={{ color: "var(--gold)" }}>
              {honeyCleared}/{LEVELS_PER_WORLD} cleared
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
