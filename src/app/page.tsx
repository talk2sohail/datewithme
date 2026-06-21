"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";
import Confetti from "@/components/confetti";
import { useAuth } from "@/components/auth-context";

function AuthBar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (user) {
    return (
      <div className="absolute top-0 right-0 z-20 p-3 sm:p-4 flex items-center gap-2">
        <span className="text-xs text-rose-400 font-medium">{user.username}</span>
        <button
          onClick={async () => {
            const { logout } = await import("@/app/actions/auth");
            logout();
          }}
          className="text-xs text-rose-400 hover:text-rose-600 underline underline-offset-2 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-0 z-20 p-3 sm:p-4">
      <button
        onClick={() => router.push("/login")}
        className="text-xs text-rose-400 hover:text-rose-600 underline underline-offset-2 transition-colors"
      >
        Sign in
      </button>
    </div>
  );
}

export default function Home() {
  const [response, setResponse] = useState<"yes" | "maybe" | null>(null);
  const [noCount, setNoCount] = useState(0);
  const [noButtonSize, setNoButtonSize] = useState(1);
  const router = useRouter();

  const noMessages = [
    "Are you sure? 🥺",
    "Think again! 💕",
    "Please? Pretty please? 🥰",
    "My heart will break 💔",
    "I'll bring chocolate! 🍫",
    "I'll write you a poem! 📝",
    "Just one date? 🌹",
    "You know you want to 😊",
    "Pleeaaase? 🙏",
    "Last chance! 😄",
  ];

  const exhaustedMessages = [
    "You're persistent! 😂",
    "Okay, this is impressive 😅",
    "The button is almost gone... 👀",
    "Just say yes already! 💕",
    "I'm not giving up! 😤",
    "Fine, I'll wait... ⏳",
    "My love is infinite 💖",
    "Only one choice left 😏",
    "Ok no more no's for you 😄",
  ];

  const noButtonVisible =
    noCount < noMessages.length + exhaustedMessages.length;

  const handleNoClick = useCallback(() => {
    setNoCount((prev) => prev + 1);
    setNoButtonSize((prev) => Math.max(prev - 0.05, 0.01));
  }, []);

  const getNoMessage = () => {
    if (noCount === 0) return "Maybe Later";
    if (noCount <= noMessages.length) return noMessages[noCount - 1];
    const exhaustedIdx = noCount - noMessages.length - 1;
    if (exhaustedIdx < exhaustedMessages.length)
      return exhaustedMessages[exhaustedIdx];
    return "...";
  };

  const handleYesClick = useCallback(() => {
    setResponse("yes");
    setTimeout(() => {
      router.push("/choose");
    }, 2500);
  }, [router]);

  if (response === "yes") {
    return (
      <>
        <Confetti />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh safe-area-top safe-area-bottom px-5 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-rose-600 animate-fade-in-up">
          Yay! 🎉💕
        </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-rose-500 animate-fade-in-up delay-200 max-w-xs sm:max-w-none">
            You just made me the happiest person! 🥰
          </p>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-rose-500/80 animate-fade-in-up delay-300 font-romantic">
            Let&apos;s plan our perfect date... 💖
          </p>
          <div className="mt-6 sm:mt-8 animate-heartbeat text-5xl sm:text-6xl">
            💕
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeartBackground />
      <AuthBar />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh safe-area-top safe-area-bottom px-5 sm:px-6">
        <div className="max-w-lg w-full text-center">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 animate-heartbeat select-none">
            ❤️
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-rose-600 mb-3 sm:mb-4 animate-fade-in-up leading-tight">
            Will You Go on a Date With Me?
          </h1>

          <p className="text-base sm:text-lg text-rose-600/80 mb-8 sm:mb-10 animate-fade-in-up delay-200 px-1 leading-relaxed">
            I&apos;ve been thinking about you and I&apos;d love to take you out
            on a special date. Say yes and let&apos;s make beautiful memories
            together! 🌹
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up delay-300">
            <button
              onClick={handleYesClick}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 transition-all duration-200 animate-heartbeat select-none min-h-[56px]"
            >
              Yes! 💕
            </button>

            {noButtonVisible && (
              <button
                onClick={handleNoClick}
                style={{ transform: `scale(${noButtonSize})` }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white/70 backdrop-blur-sm text-gray-600 text-sm font-medium rounded-full border border-rose-200 hover:bg-white/90 active:scale-95 transition-all duration-200 select-none min-h-[48px]"
              >
                {getNoMessage()}
              </button>
            )}
          </div>

          {!noButtonVisible && noCount > 0 && (
            <p className="mt-4 text-rose-500 text-base sm:text-lg font-medium animate-fade-in-up">
              Looks like you only have one choice now... 💕
            </p>
          )}

          <button
            onClick={() => router.push("/history")}
            className="mt-6 text-rose-400 hover:text-rose-600 text-xs sm:text-sm underline underline-offset-4 transition-colors"
          >
            📖 View our date history
          </button>

          {noCount > 3 && noButtonVisible && (
            <p className="mt-5 sm:mt-6 text-rose-400 text-xs sm:text-sm animate-fade-in-up">
              You know the button keeps shrinking, right? 😄
            </p>
          )}
        </div>
      </div>
    </>
  );
}
