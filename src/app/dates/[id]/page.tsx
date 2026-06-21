"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";
import {
  LocationPinIcon,
  ForkKnifeIcon,
  HeartCalendarIcon,
  LoveHeartIcon,
} from "@/components/icons";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
}

interface DateDetail {
  id: string;
  title: string | null;
  places: string[];
  foods: string[];
  dateTime: string;
  status: string;
  notes: string | null;
  photos: Photo[];
}

export default function DateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [date, setDate] = useState<DateDetail | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/dates?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setDate(data);
          setPhotos(data.photos || []);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpload = async () => {
    if (!selectedFile || !date) return;
    setUploading(true);
    setUploadMsg("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caption", caption);
      formData.append("dateId", date.id);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newPhoto = await res.json();
        setPhotos((prev) => [newPhoto, ...prev]);
        setCaption("");
        setSelectedFile(null);
        setUploadMsg("Photo added! 📸");
      } else {
        setUploadMsg("Upload failed.");
      }
    } catch {
      setUploadMsg("Upload failed.");
    }
    setUploading(false);
  };

  const formatDate = (dateStr: string) => {
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
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoveHeartIcon size={32} className="text-rose-400 animate-heartbeat" />
      </div>
    );
  }

  if (!date) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <p className="text-rose-500 text-lg">Date not found</p>
        <button
          onClick={() => router.push("/history")}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full"
        >
          Back to History
        </button>
      </div>
    );
  }

  const { date: dateStr, time } = formatDate(date.dateTime);

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh safe-area-top safe-area-bottom">
        {/* Back button */}
        <div className="px-4 py-3 sm:py-4">
          <button
            onClick={() => router.push("/history")}
            className="inline-flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 transition-colors font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to History
          </button>
        </div>

        {/* ── Photo View ── */}
        <div className="animate-fade-in-up px-4 sm:px-6">
          {photos.length > 0 ? (
            <div className="relative max-w-lg mx-auto">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={photos[carouselIdx].imageUrl}
                  alt={
                    photos[carouselIdx].caption || `Photo ${carouselIdx + 1}`
                  }
                  className="w-full aspect-[4/3] object-cover"
                />
                {photos[carouselIdx].caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
                    <p className="text-white text-sm font-medium">
                      {photos[carouselIdx].caption}
                    </p>
                  </div>
                )}
              </div>

              {/* Prev / Next arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCarouselIdx((prev) =>
                        prev === 0 ? photos.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-rose-500 hover:bg-white transition-all active:scale-90"
                    aria-label="Previous photo"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M11 4L6 9l5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCarouselIdx((prev) =>
                        prev === photos.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-rose-500 hover:bg-white transition-all active:scale-90"
                    aria-label="Next photo"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M7 4l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {photos.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-2.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === carouselIdx
                          ? "w-5 bg-rose-500"
                          : "w-1.5 bg-rose-300"
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-lg mx-auto rounded-2xl overflow-hidden aspect-[4/3] bg-rose-50/60 flex items-center justify-center border-2 border-dashed border-rose-200">
              <div className="text-center">
                <LoveHeartIcon
                  size={40}
                  className="text-rose-300 mx-auto mb-1.5"
                />
                <p className="text-sm text-rose-400/70">No photos yet</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Date Details ── */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-5 sm:p-6 border border-rose-200 animate-fade-in-up">
              {/* Title */}
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-rose-600 leading-tight">
                  {date.title || `Date at ${date.places[0] || "?"}`}
                </h2>
                <p className="text-rose-400/70 text-sm mt-1 font-romantic">
                  {dateStr}
                </p>
              </div>

              {/* Date & Time */}
              <div className="bg-rose-50 rounded-2xl p-4 mb-3 border border-rose-100">
                <p className="text-xs label mb-1 text-rose-400">Date & Time</p>
                <p className="text-base font-semibold text-rose-700">
                  {dateStr} at {time}
                </p>
              </div>

              {/* Places */}
              <div className="bg-rose-50 rounded-2xl p-4 mb-3 border border-rose-100">
                <p className="text-xs label mb-2 text-rose-400">
                  {date.places.length > 1 ? "Places Visited" : "Place"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {date.places.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-rose-700 rounded-full text-sm font-medium shadow-sm"
                    >
                      <LocationPinIcon size={13} className="text-rose-400" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Foods */}
              <div className="bg-rose-50 rounded-2xl p-4 mb-3 border border-rose-100">
                <p className="text-xs label mb-2 text-rose-400">
                  {date.foods.length > 1 ? "Food & Drinks" : "Food"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {date.foods.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-rose-600 rounded-full text-sm font-medium shadow-sm"
                    >
                      <ForkKnifeIcon size={13} className="text-rose-400" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {date.notes && (
                <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                  <p className="text-xs label mb-1 text-rose-400">Notes</p>
                  <p className="text-sm text-rose-600 leading-relaxed italic font-romantic">
                    {date.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Upload + Remaining Photos ── */}
        <div className="px-4 sm:px-6 pt-6 pb-8 sm:pb-12 mobile-nav-safe">
          <div className="max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-rose-600 mb-3">
              {photos.length > 0 ? "Add More Photos" : "Add Photos"}
            </h3>

            {/* Upload box */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-rose-200 mb-4 animate-fade-in-up">
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

            {/* Remaining photos grid */}
            {photos.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.slice(1).map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white/80 rounded-2xl overflow-hidden border border-rose-200 shadow-sm"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || "Date photo"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {photo.caption && (
                      <p className="px-3 py-2 text-xs text-rose-600 font-medium truncate">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white/95 to-white/0 pt-6 px-4 pb-6 safe-area-bottom">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              onClick={() => router.push("/history")}
              className="flex-1 px-4 py-3 bg-white/90 text-rose-600 border border-rose-200 rounded-full hover:bg-rose-50 transition-all font-medium text-sm min-h-[48px] inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <HeartCalendarIcon size={16} />
              History
            </button>
            <button
              onClick={() => router.push("/choose")}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium text-sm min-h-[48px] active:scale-95 transition-all shadow-md"
            >
              Plan Another
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
