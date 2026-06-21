"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { register, type AuthState } from "@/app/actions/auth";
import HeartBackground from "@/components/heart-bg";

export default function SignupPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    undefined,
  );

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-rose-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">💑</div>
              <h1 className="text-2xl font-bold text-rose-600">
                Join the Love
              </h1>
              <p className="text-sm text-rose-400 mt-1">
                Create your account to start planning
              </p>
            </div>

            <form action={action} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-rose-600 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-base min-h-[48px]"
                  placeholder="Choose a username"
                />
                {state?.errors?.username && (
                  <p className="mt-1 text-xs text-rose-500">
                    {state.errors.username[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-rose-600 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-base min-h-[48px]"
                  placeholder="Create a password"
                />
                {state?.errors?.password && (
                  <p className="mt-1 text-xs text-rose-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {state?.message && (
                <p className="text-sm text-rose-500 text-center">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[52px] text-base select-none"
              >
                {pending ? "Creating account..." : "Create Account 💕"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-rose-400">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-rose-600 font-semibold hover:text-rose-700 underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
