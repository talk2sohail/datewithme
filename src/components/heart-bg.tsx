"use client";

import { useState } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function getHeartCount(): number {
  if (typeof window === "undefined") return 15;
  if (window.innerWidth < 640) return 10;
  if (window.innerWidth < 1024) return 15;
  return 20;
}

export default function HeartBackground() {
  const [hearts] = useState<Heart[]>(() => {
    const count = getHeartCount();
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 16 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 3,
      opacity: Math.random() * 0.3 + 0.15,
    }));
  });

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float select-none"
          style={{
            left: `${heart.x}%`,
            bottom: "-5%",
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            opacity: heart.opacity,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
