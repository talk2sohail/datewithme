"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";

export default function CreateCouplePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");
    startTransition(async () => {
      try {
        const mod = await import("@/app/actions/couple");
        const result = await mod.createCouple();
        if (result.error) {
          setError(result.error);
        } else if (result.inviteCode) {
          setInviteCode(result.inviteCode);
        }
      } catch {
        setError("Something went wrong. Try again.");
      }
    });
  };

  if (inviteCode) {
    return (
      <ShowCode
        inviteCode={inviteCode}
        onContinue={() => router.push("/history")}
      />
    );
  }

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200 text-center">
            <div className="text-4xl mb-3">💑</div>
            <h1 className="text-2xl font-bold text-rose-600 mb-2">
              You&apos;re the First One!
            </h1>
            <p className="text-sm text-rose-500 mb-6 leading-relaxed">
              Create your couple and get an invite code to share with your
              partner so you can share your date memories together.
            </p>

            <button
              onClick={handleCreate}
              disabled={pending}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 transition-all duration-200 min-h-[52px] text-base select-none"
            >
              {pending ? "Creating..." : "Create Our Couple 💕"}
            </button>

            {error && (
              <p className="mt-3 text-sm text-rose-500">{error}</p>
            )}

            <p className="mt-5 text-sm text-rose-400">
              Your partner already has an account?{" "}
              <button
                onClick={() => router.push("/couple/join")}
                className="text-rose-600 font-semibold hover:text-rose-700 underline underline-offset-2"
              >
                Join with a code
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function ShowCode({
  inviteCode,
  onContinue,
}: {
  inviteCode: string;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-2xl font-bold text-rose-600 mb-2">
              Couple Created!
            </h1>
            <p className="text-sm text-rose-500 mb-6 leading-relaxed">
              Share this code with your partner so they can join and share your
              date memories together.
            </p>

            <div
              onClick={copy}
              className="cursor-pointer select-all inline-block px-8 py-4 bg-rose-50 border-2 border-dashed border-rose-300 rounded-2xl mb-4"
            >
              <p className="text-xs text-rose-400 mb-1 font-medium">
                {copied ? "Copied! ✅" : "Invite Code — tap to copy"}
              </p>
              <p className="text-3xl font-bold text-rose-600 tracking-[0.25em]">
                {inviteCode}
              </p>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 min-h-[52px] text-base select-none"
            >
              Start Planning Dates 💕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
