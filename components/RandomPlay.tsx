"use client";

import { useEffect, useState } from "react";
import TronBoard from "./TronBoard";
import HoneyBoard from "./HoneyBoard";
import { generatePuzzle } from "@/lib/puzzle";
import { generateHexPuzzle } from "@/lib/puzzle-hex";
import type { HexPuzzle, TrianglePuzzle, World } from "@/lib/types";

interface Props {
  world: World;
  playerName: string;
}

export default function RandomPlay({ world, playerName }: Props) {
  const [tronPuzzle, setTronPuzzle] = useState<TrianglePuzzle | null>(null);
  const [hexPuzzle, setHexPuzzle] = useState<HexPuzzle | null>(null);

  useEffect(() => {
    if (world === "tron") {
      setTronPuzzle(generatePuzzle());
      setHexPuzzle(null);
    } else {
      setHexPuzzle(generateHexPuzzle());
      setTronPuzzle(null);
    }
  }, [world]);

  if (world === "tron") {
    if (!tronPuzzle) {
      return <Loading tint="var(--cyan)" />;
    }
    return (
      <TronBoard
        puzzle={tronPuzzle}
        level="random"
        playerName={playerName}
        reshuffleRandom={() => generatePuzzle()}
      />
    );
  }

  if (!hexPuzzle) {
    return <Loading tint="var(--gold)" />;
  }
  return (
    <HoneyBoard
      puzzle={hexPuzzle}
      level="random"
      playerName={playerName}
      reshuffleRandom={() => generateHexPuzzle()}
    />
  );
}

function Loading({ tint }: { tint: string }) {
  return (
    <div className="h-dvh flex items-center justify-center text-sm" style={{ color: tint }}>
      Spinning up…
    </div>
  );
}
