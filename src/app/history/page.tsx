"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";
import {
  HeartCalendarIcon,
  LoveLetterIcon,
  LocationPinIcon,
  ForkKnifeIcon,
  ChevronRightIcon,
  LoveHeartIcon,
} from "@/components/icons";

interface DateRecord {
  id: string;
  places: string[];
  foods: string[];
  dateTime: string;
  status: string;
  photos: { imageUrl: string }[];
}

export default function HistoryPage() {
  const [dates, setDates] = useState<DateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupleInfo, setCoupleInfo] = useState<{
    inviteCode: string;
    partnerUsername?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [datesRes, coupleRes] = await Promise.all([
          fetch("/api/dates"),
          fetch("/api/auth/couple"),
        ]);
        if (cancelled) return;
        if (datesRes.ok) {
          const data = await datesRes.json();
          setDates(data);
        }
        if (coupleRes.ok) {
          const data = await coupleRes.json();
          setCoupleInfo(data);
        }
      } catch {
        // ignore
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoveHeartIcon size={32} className="text-rose-400 animate-heartbeat" />
      </div>
    );
  }

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh py-8 sm:py-12 safe-area-top safe-area-bottom px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
            <HeartCalendarIcon
              size={52}
              className="text-rose-500 mx-auto mb-3"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-600 mb-1 leading-tight">
              Our Date History
            </h1>
            <p className="text-sm sm:text-base text-rose-500/70">
              Every beautiful memory we&apos;ve made together
            </p>
          </div>

          {coupleInfo && (
            <div className="mb-6 sm:mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-rose-200 animate-fade-in-up flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">💑</span>
                <div className="min-w-0">
                  <p className="text-xs text-rose-400 font-medium">
                    Couple
                  </p>
                  <p className="text-sm text-rose-700 font-semibold truncate">
                    {coupleInfo.partnerUsername
                      ? `You & ${coupleInfo.partnerUsername}`
                      : "Waiting for your partner to join"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coupleInfo.inviteCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="shrink-0 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-full text-xs font-medium transition-colors"
              >
                {copied ? "Copied!" : `Code: ${coupleInfo.inviteCode}`}
              </button>
            </div>
          )}

          {dates.length === 0 ? (
            <div className="text-center py-16 animate-fade-in-up">
              <LoveHeartIcon size={64} className="text-rose-300 mx-auto mb-4" />
              <p className="text-xl text-rose-500/80">No dates planned yet!</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium min-h-[48px]"
              >
                Plan Our First Date
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {dates.map((dateRecord, index) => {
                const { date, time } = formatDate(dateRecord.dateTime);
                const places = dateRecord.places;
                const foods = dateRecord.foods;
                const thumbnail = dateRecord.photos?.[0]?.imageUrl;

                return (
                  <button
                    key={dateRecord.id}
                    onClick={() => router.push(`/dates/${dateRecord.id}`)}
                    className="w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-sm hover:shadow-lg hover:border-rose-300 active:scale-[0.99] transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-rose-100/80 flex items-center justify-center">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LoveLetterIcon
                            size={28}
                            className="text-rose-400/70"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-rose-200/60 text-rose-600 rounded-full font-medium">
                            {date}
                          </span>
                          <span className="text-xs text-rose-400/70">
                            {time}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {places.slice(0, 3).map((p, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[11px] sm:text-xs font-medium"
                            >
                              <LocationPinIcon size={11} />
                              {p}
                            </span>
                          ))}
                          {places.length > 3 && (
                            <span className="text-[11px] text-rose-400/70 self-center">
                              +{places.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap gap-1">
                          {foods.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[11px] sm:text-xs font-medium"
                            >
                              <ForkKnifeIcon size={11} />
                              {f}
                            </span>
                          ))}
                          {foods.length > 3 && (
                            <span className="text-[11px] text-rose-400/70 self-center">
                              +{foods.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRightIcon
                        size={20}
                        className="shrink-0 self-center text-rose-300"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom actions */}
          <div className="text-center mt-8 sm:mt-10 mobile-nav-safe">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-white/80 text-rose-600 border-2 border-rose-300 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all font-medium text-sm sm:text-base min-h-[48px]"
            >
              Plan a New Date
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
