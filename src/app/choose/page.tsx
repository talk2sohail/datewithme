"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HeartBackground from "@/components/heart-bg";

const PLACES = [
  { emoji: "🏖️", label: "Beach" },
  { emoji: "🎬", label: "Movies" },
  { emoji: "🌳", label: "Park" },
  { emoji: "🏛️", label: "Museum" },
  { emoji: "🎡", label: "Amusement Park" },
  { emoji: "🏔️", label: "Mountains" },
  { emoji: "🛍️", label: "Shopping" },
  { emoji: "🎭", label: "Theater" },
  { emoji: "🎵", label: "Concert" },
  { emoji: "🍷", label: "Wine Tasting" },
  { emoji: "🎳", label: "Bowling" },
  { emoji: "🚤", label: "Boating" },
];

const FOODS = [
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🍜", label: "Ramen" },
  { emoji: "🥗", label: "Salad" },
  { emoji: "🍝", label: "Pasta" },
  { emoji: "🌮", label: "Tacos" },
  { emoji: "🥩", label: "Steak" },
  { emoji: "🍰", label: "Dessert" },
  { emoji: "🍦", label: "Ice Cream" },
  { emoji: "🥘", label: "Hot Pot" },
  { emoji: "🍳", label: "Brunch" },
  { emoji: "🥟", label: "Dim Sum" },
];

export default function ChoosePage() {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [customPlace, setCustomPlace] = useState("");
  const [customFood, setCustomFood] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const togglePlace = useCallback((label: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label],
    );
    setCustomPlace("");
  }, []);

  const toggleFood = useCallback((label: string) => {
    setSelectedFoods((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
    setCustomFood("");
  }, []);

  const addCustomPlace = useCallback(() => {
    const trimmed = customPlace.trim();
    if (trimmed && !selectedPlaces.includes(trimmed)) {
      setSelectedPlaces((prev) => [...prev, trimmed]);
    }
    setCustomPlace("");
  }, [customPlace, selectedPlaces]);

  const addCustomFood = useCallback(() => {
    const trimmed = customFood.trim();
    if (trimmed && !selectedFoods.includes(trimmed)) {
      setSelectedFoods((prev) => [...prev, trimmed]);
    }
    setCustomFood("");
  }, [customFood, selectedFoods]);

  const removePlace = useCallback((label: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p !== label));
  }, []);

  const removeFood = useCallback((label: string) => {
    setSelectedFoods((prev) => prev.filter((f) => f !== label));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allPlaces =
      selectedPlaces.length > 0
        ? selectedPlaces
        : [customPlace].filter(Boolean);
    const allFoods =
      selectedFoods.length > 0 ? selectedFoods : [customFood].filter(Boolean);
    if (allPlaces.length === 0 || allFoods.length === 0 || !date || !time)
      return;

    setIsSubmitting(true);
    const dateTime = `${date}T${time}:00`;

    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          places: allPlaces,
          foods: allFoods,
          dateTime: new Date(dateTime).toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/card?id=${data.id}`);
      } else {
        router.push(
          `/card?places=${encodeURIComponent(JSON.stringify(allPlaces))}&foods=${encodeURIComponent(JSON.stringify(allFoods))}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
        );
      }
    } catch {
      router.push(
        `/card?places=${encodeURIComponent(JSON.stringify(allPlaces))}&foods=${encodeURIComponent(JSON.stringify(allFoods))}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
      );
    }
  };

  return (
    <>
      <HeartBackground />
      <div className="relative z-10 min-h-dvh py-6 sm:py-12 safe-area-top safe-area-bottom px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <div className="text-4xl sm:text-5xl mb-3">💑</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-600 mb-1 leading-tight">
              Plan Our Perfect Date!
            </h1>
            <p className="text-sm sm:text-base text-rose-500">
              Pick everything you&apos;d love to do! 💕
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Place Selection */}
            <div className="animate-slide-left">
              <label className="block text-base sm:text-xl font-semibold text-rose-600 mb-2 sm:mb-3">
                📍 Where should we go?{" "}
                <span className="text-xs sm:text-sm font-normal text-rose-400">
                  (pick multiple!)
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {PLACES.map((p) => {
                  const isSelected = selectedPlaces.includes(p.label);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => togglePlace(p.label)}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 text-center active:scale-95 select-none min-h-[52px] sm:min-h-[65px] flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-rose-500 bg-rose-100 shadow-md ring-2 ring-rose-300"
                          : "border-rose-200 hover:border-rose-300 bg-white/70 hover:bg-white/90"
                      }`}
                    >
                      <div className="text-lg sm:text-2xl">{p.emoji}</div>
                      <div className="text-[10px] sm:text-sm mt-0.5 sm:mt-1 font-medium text-rose-700 leading-tight">
                        {p.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px] sm:text-xs">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom place input */}
              <div className="mt-2 sm:mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a custom place..."
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustomPlace())
                  }
                  className="flex-1 px-4 py-3 sm:py-2.5 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-sm sm:text-base min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={addCustomPlace}
                  disabled={!customPlace.trim()}
                  className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl border-2 border-rose-200 hover:bg-rose-200 disabled:opacity-40 transition-all font-medium text-sm min-h-[48px]"
                >
                  Add
                </button>
              </div>

              {/* Selected places tags */}
              {selectedPlaces.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedPlaces.map((place) => (
                    <span
                      key={place}
                      className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {place}
                      <button
                        type="button"
                        onClick={() => removePlace(place)}
                        className="ml-0.5 text-rose-400 hover:text-rose-600 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Food Selection */}
            <div className="animate-slide-right">
              <label className="block text-base sm:text-xl font-semibold text-rose-600 mb-2 sm:mb-3">
                🍽️ What should we eat?{" "}
                <span className="text-xs sm:text-sm font-normal text-rose-400">
                  (pick multiple!)
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {FOODS.map((f) => {
                  const isSelected = selectedFoods.includes(f.label);
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => toggleFood(f.label)}
                      className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-200 text-center active:scale-95 select-none min-h-[52px] sm:min-h-[65px] flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-rose-500 bg-rose-100 shadow-md ring-2 ring-rose-300"
                          : "border-rose-200 hover:border-rose-300 bg-white/70 hover:bg-white/90"
                      }`}
                    >
                      <div className="text-lg sm:text-2xl">{f.emoji}</div>
                      <div className="text-[10px] sm:text-sm mt-0.5 sm:mt-1 font-medium text-rose-700 leading-tight">
                        {f.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px] sm:text-xs">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom food input */}
              <div className="mt-2 sm:mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a custom food..."
                  value={customFood}
                  onChange={(e) => setCustomFood(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCustomFood())
                  }
                  className="flex-1 px-4 py-3 sm:py-2.5 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 placeholder-rose-300 text-sm sm:text-base min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={addCustomFood}
                  disabled={!customFood.trim()}
                  className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl border-2 border-rose-200 hover:bg-rose-200 disabled:opacity-40 transition-all font-medium text-sm min-h-[48px]"
                >
                  Add
                </button>
              </div>

              {/* Selected foods tags */}
              {selectedFoods.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedFoods.map((food) => (
                    <span
                      key={food}
                      className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {food}
                      <button
                        type="button"
                        onClick={() => removeFood(food)}
                        className="ml-0.5 text-rose-400 hover:text-rose-600 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Date & Time - Improved with separate inputs */}
            <div className="animate-fade-in-up delay-300">
              <label className="block text-base sm:text-xl font-semibold text-rose-600 mb-3 sm:mb-4">
                ⏰ When should we meet?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Date picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-rose-400">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3.5 sm:py-3 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 text-base min-h-[52px] [color-scheme:light]"
                    required
                  />
                </div>
                {/* Time picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-rose-400">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3.5 sm:py-3 rounded-xl border-2 border-rose-200 bg-white/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-700 text-base min-h-[52px] [color-scheme:light]"
                    required
                  />
                </div>
              </div>
              {/* Quick date suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["Today", "Tomorrow", "This Weekend"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      if (label === "Tomorrow") d.setDate(d.getDate() + 1);
                      if (label === "This Weekend") {
                        const day = d.getDay();
                        const daysUntilSat =
                          day === 0 ? -1 : day === 6 ? 0 : 6 - day;
                        d.setDate(d.getDate() + daysUntilSat);
                      }
                      setDate(d.toISOString().split("T")[0]);
                      if (!time) setTime("18:00");
                    }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/70 text-rose-600 border border-rose-200 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-all text-xs sm:text-sm font-medium"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {(selectedPlaces.length > 0 ||
              selectedFoods.length > 0 ||
              (date && time)) && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-rose-200 animate-fade-in-up">
                <h3 className="text-sm font-semibold text-rose-600 mb-2">
                  ✨ Your Date Plan
                </h3>
                <div className="space-y-1 text-sm text-rose-700">
                  {selectedPlaces.length > 0 && (
                    <p>
                      📍 <span className="font-medium">Places:</span>{" "}
                      {selectedPlaces.join(", ")}
                    </p>
                  )}
                  {selectedFoods.length > 0 && (
                    <p>
                      🍽️ <span className="font-medium">Food:</span>{" "}
                      {selectedFoods.join(", ")}
                    </p>
                  )}
                  {date && time && (
                    <p>
                      ⏰ <span className="font-medium">When:</span>{" "}
                      {new Date(`${date}T${time}`).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(`${date}T${time}`).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="text-center pt-2 sm:pt-4 mobile-nav-safe">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  selectedPlaces.length === 0 ||
                  selectedFoods.length === 0 ||
                  !date ||
                  !time
                }
                className="w-full sm:w-auto px-8 sm:px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[56px] select-none"
              >
                {isSubmitting ? "Creating..." : "Create Our Date Card! 💕"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
