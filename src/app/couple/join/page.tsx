"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";

export default function JoinCouplePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError("");

    startTransition(async () => {
      try {
        const mod = await import("@/app/actions/couple");
        const formData = new FormData();
        formData.set("code", code);
        const result = await mod.joinCouple(formData);
        if (result.error) {
          setError(result.error);
        } else if (result.ok) {
          router.push("/history");
        }
      } catch {
        setError("Something went wrong. Try again.");
      }
    });
  };

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🔗</div>
              <h1 className="text-2xl font-bold text-rose-600">
                Join Your Partner
              </h1>
              <p className="text-sm text-rose-400 mt-1">
                Enter the invite code your partner shared with you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-rose-600 mb-1"
                >
                  Invite Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A1B2C3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-base text-center uppercase tracking-widest font-bold min-h-[48px]"
                  autoComplete="off"
                />
              </div>

              {error && (
                <p className="text-sm text-rose-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={pending || !code.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[52px] text-base select-none"
              >
                {pending ? "Joining..." : "Join 💕"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-rose-400">
              No code yet?{" "}
              <button
                onClick={() => router.push("/couple/create")}
                className="text-rose-600 font-semibold hover:text-rose-700 underline underline-offset-2"
              >
                Create a couple
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
