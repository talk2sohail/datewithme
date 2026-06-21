"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";
import Confetti from "@/components/confetti";
import { HeartCalendarIcon } from "@/components/icons";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
}

export default function CardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = use(searchParams);
  const [dateInfo, setDateInfo] = useState<{
    places: string[];
    foods: string[];
    dateTime: string;
    id?: string;
  } | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadDate() {
      try {
        if (params.id) {
          const res = await fetch(`/api/dates?id=${params.id}`);
          if (res.ok) {
            const data = await res.json();
            setDateInfo({
              places: data.places,
              foods: data.foods,
              dateTime: data.dateTime,
              id: data.id,
            });
            setPhotos(data.photos || []);
            setLoading(false);
            return;
          }
        }
        if (params.places && params.foods && params.date && params.time) {
          const places = JSON.parse(decodeURIComponent(params.places));
          const foods = JSON.parse(decodeURIComponent(params.foods));
          setDateInfo({
            places: Array.isArray(places) ? places : [places],
            foods: Array.isArray(foods) ? foods : [foods],
            dateTime: `${params.date}T${params.time}:00`,
          });
        }
      } catch {
        // handled below
      }
      setLoading(false);
    }
    loadDate();
  }, [params]);

  const handleUpload = async () => {
    if (!selectedFile || !dateInfo?.id) return;
    setUploading(true);
    setUploadMsg("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caption", caption);
      formData.append("dateId", dateInfo.id);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newPhoto = await res.json();
        setPhotos((prev) => [newPhoto, ...prev]);
        setCaption("");
        setSelectedFile(null);
        setUploadMsg("Photo added to this date! 📸");
      } else {
        setUploadMsg("Upload failed. Try again.");
      }
    } catch {
      setUploadMsg("Upload failed.");
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-rose-500 text-xl animate-heartbeat select-none">
          💕
        </div>
      </div>
    );
  }

  if (!dateInfo) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 safe-area-top safe-area-bottom">
        <p className="text-rose-500 text-lg sm:text-xl">
          No date info found 😢
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm sm:text-base rounded-full min-h-[48px]"
        >
          Start Over
        </button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  const { date, time } = formatDate(dateInfo.dateTime);

  return (
    <>
      <Confetti />
      <HeartBackground />
      <div className="relative z-10 min-h-dvh py-8 sm:py-12 px-4 safe-area-top safe-area-bottom">
        <div className="max-w-md w-full mx-auto">
          {/* The Flash Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border-2 border-rose-200 animate-fade-in-up">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-5xl mb-2">💌</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 leading-tight">
                Our Date Card! 💕
              </h1>
              <p className="text-sm sm:text-base text-rose-400 mt-1">
                {dateInfo.id
                  ? "A beautiful memory we made 🥰"
                  : "Can't wait for our special day! 🥰"}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-slide-left">
                <div className="text-2xl sm:text-3xl shrink-0">📍</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-rose-400 font-medium">
                    {dateInfo.places.length > 1 ? "Places" : "Place"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {dateInfo.places.map((place, i) => (
                      <span
                        key={i}
                        className="inline-block px-2.5 py-1 bg-rose-200/60 text-rose-700 rounded-full text-xs sm:text-sm font-semibold"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-slide-right">
                <div className="text-2xl sm:text-3xl shrink-0">🍽️</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-rose-400 font-medium">
                    {dateInfo.foods.length > 1 ? "Foods" : "Food"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {dateInfo.foods.map((food, i) => (
                      <span
                        key={i}
                        className="inline-block px-2.5 py-1 bg-rose-200/60 text-rose-700 rounded-full text-xs sm:text-sm font-semibold"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-fade-in-up delay-300">
                <div className="text-2xl sm:text-3xl shrink-0">⏰</div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-rose-400 font-medium">
                    Date & Time
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-rose-700 break-words">
                    {date}
                  </p>
                  {time && (
                    <p className="text-xs sm:text-sm text-rose-500 mt-0.5">
                      {time}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center border-t border-rose-100 pt-4 sm:pt-6">
              <p className="text-sm sm:text-base text-rose-500/80 italic leading-relaxed font-romantic">
                &ldquo;Every moment with you is a beautiful memory in the
                making. I can&apos;t wait to make this one extra special.
                💖&rdquo;
              </p>
              <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl animate-heartbeat select-none">
                💗
              </div>
            </div>
          </div>

          {/* Photos from this Date */}
          {dateInfo.id && (
            <div className="mt-6 animate-fade-in-up delay-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-rose-600">
                  📸 Photos from This Date
                </h2>
                <span className="text-xs text-rose-400">
                  {photos.length} photo{photos.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Mini upload */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-rose-200 mb-3">
                {/* File row */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 border-2 border-dashed border-rose-200 hover:border-rose-300 rounded-xl cursor-pointer transition-all text-xs text-rose-600 min-h-[40px] overflow-hidden">
                    <span className="shrink-0 text-base">📷</span>
                    <span className="truncate">
                      {selectedFile ? selectedFile.name : "Choose a photo..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="shrink-0 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-xs font-medium disabled:opacity-50 active:scale-95 transition-all min-h-[40px]"
                  >
                    {uploading ? "..." : "Add Photo"}
                  </button>
                </div>

                {/* Caption row */}
                <input
                  type="text"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white/60 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs text-rose-700 placeholder-rose-300 min-h-[40px]"
                />
                {uploadMsg && (
                  <p className="mt-1.5 text-xs text-rose-500">{uploadMsg}</p>
                )}
              </div>

              {/* Photo grid */}
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white/80 rounded-xl overflow-hidden border border-rose-200 shadow-sm"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption || "Date photo"}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      {photo.caption && (
                        <p className="px-2 py-1.5 text-[11px] text-rose-600 font-medium truncate">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-rose-400 py-4 bg-white/40 rounded-2xl border border-dashed border-rose-200">
                  No photos yet. Add one above! 📸
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 mobile-nav-safe">
            <button
              onClick={() => router.push("/history")}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3.5 bg-white/80 backdrop-blur-sm text-rose-600 border-2 border-rose-300 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all duration-200 font-medium text-sm sm:text-base min-h-[48px] select-none inline-flex items-center justify-center gap-2"
            >
              <HeartCalendarIcon size={16} />
              Date History
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3.5 bg-white/80 backdrop-blur-sm text-rose-600 border-2 border-rose-300 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all duration-200 font-medium text-sm sm:text-base min-h-[48px] select-none"
            >
              💕 Plan Another
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
