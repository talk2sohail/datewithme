"use client";

import { useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  symbol: string;
}

function getConfettiCount(): number {
  if (typeof window === "undefined") return 20;
  if (window.innerWidth < 640) return 15;
  if (window.innerWidth < 1024) return 25;
  return 35;
}

export default function Confetti() {
  const [pieces] = useState<ConfettiPiece[]>(() => {
    const count = getConfettiCount();
    const symbols = ["❤️", "💕", "✨", "🌸", "💖", "🎀", "💗", "🌹"];
    const colors = [
      "#e11d48",
      "#fb7185",
      "#f43f5e",
      "#fda4af",
      "#fbcfe8",
      "#d946ef",
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      rotation: Math.random() * 360,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));
  });

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-sparkle select-none"
          style={{
            left: `${piece.x}%`,
            top: "-5%",
            fontSize: "20px",
            animationDelay: `${piece.delay}s`,
            animationDuration: "2s",
            transform: `rotate(${piece.rotation}deg)`,
          }}
        >
          {piece.symbol}
        </div>
      ))}
    </div>
  );
}
