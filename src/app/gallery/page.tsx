"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  date: { places: string[]; dateTime: string } | null;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch {
      // ignore
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caption", caption);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Photo uploaded! 📸");
        setCaption("");
        setSelectedFile(null);
        fetchPhotos();
      } else {
        setMessage("Upload failed. Try again.");
      }
    } catch {
      setMessage("Upload failed.");
    }
    setUploading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh py-8 sm:py-12 safe-area-top safe-area-bottom px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-10 animate-fade-in-up">
            <div className="text-4xl sm:text-5xl mb-3">📸</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-600 mb-1 leading-tight">
              All Our Memories
            </h1>
            <p className="text-sm sm:text-base text-rose-500">
              Every photo tells a story of our love 💕
            </p>
          </div>

          {/* Upload */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-rose-200 animate-fade-in-up">
            <h2 className="text-base sm:text-lg font-semibold text-rose-600 mb-3">
              Upload a Photo 📤
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 bg-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-500 file:text-white file:text-sm file:font-medium hover:file:bg-rose-600 text-sm text-rose-700 min-h-[48px]"
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="flex-1 px-4 py-3 sm:py-2.5 rounded-xl border-2 border-rose-200 bg-white/60 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-sm sm:text-base min-h-[48px]"
                />
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg transition-all duration-200 text-sm sm:text-base min-h-[48px] select-none"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
            {message && <p className="mt-2 text-sm text-rose-500">{message}</p>}
          </div>

          {/* Photo Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-12 sm:py-16 animate-fade-in-up">
              <div className="text-5xl sm:text-6xl mb-4">🌹</div>
              <p className="text-lg sm:text-xl text-rose-500">No photos yet!</p>
              <p className="text-sm sm:text-base text-rose-400 mt-2">
                Upload some after our date. 💕
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-rose-200 shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up active:scale-[0.98]"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || "Date photo"}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    {photo.date && (
                      <p className="text-[11px] text-rose-400 font-medium">
                        📍 {photo.date.places[0] || "Our Date"} ·{" "}
                        {formatDate(photo.date.dateTime)}
                      </p>
                    )}
                    {photo.caption && (
                      <p className="text-sm sm:text-base text-rose-700 font-medium leading-tight mt-0.5">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-rose-200 mobile-nav-safe justify-center">
            <button
              onClick={() => router.push("/history")}
              className="px-6 py-3 bg-white/80 text-rose-600 border-2 border-rose-300 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all font-medium text-sm sm:text-base min-h-[48px]"
            >
              📖 View Date History
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-white/80 text-rose-600 border-2 border-rose-300 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all font-medium text-sm sm:text-base min-h-[48px]"
            >
              💕 Plan a Date
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
