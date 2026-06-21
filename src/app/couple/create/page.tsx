"use client";

import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";

export default function CreateCouplePage() {
  const router = useRouter();

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

            <form
              action={async () => {
                const { createCouple } = await import("@/app/actions/couple");
                createCouple();
              }}
            >
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 min-h-[52px] text-base select-none"
              >
                Create Our Couple 💕
              </button>
            </form>

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
