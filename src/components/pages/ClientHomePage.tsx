"use client";

import { useEffect, useState } from "react";
import { MapPin, Camera, Star, Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";

type Pantry = {
  id: string;
  name: string;
  location: string;
  ratingAverage: number | null;
  waitTimeMinutesAverage: number | null;
  status: string | null;
};

export function ClientHomePage() {
  const { setPage } = useApp();
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/map-data")
      .then((r) => r.json())
      .then((d) => {
        setPantries(d.pantries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const published = pantries.filter((p) => p.status === "PUBLISHED" || p.status == null);
  const withRating = published.filter((p) => p.ratingAverage != null);
  const withWait = published.filter((p) => p.waitTimeMinutesAverage != null);

  const avgRating =
    withRating.length > 0
      ? (withRating.reduce((s, p) => s + (p.ratingAverage ?? 0), 0) / withRating.length).toFixed(1)
      : null;

  const avgWait =
    withWait.length > 0
      ? Math.round(withWait.reduce((s, p) => s + (p.waitTimeMinutesAverage ?? 0), 0) / withWait.length)
      : null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Find food resources near you and help your community by submitting pantry photos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <MapPin className="w-5 h-5 text-[#2E7D32] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "—" : published.length.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Food Resources</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "—" : avgRating ?? "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "—" : avgWait != null ? `${avgWait}m` : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg Wait Time</p>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => setPage("map")}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl p-6 text-left transition-colors group"
        >
          <MapPin className="w-7 h-7 mb-3 opacity-90" />
          <p className="font-semibold text-lg">Find Food Near You</p>
          <p className="text-sm text-white/70 mt-1">
            Browse the map to locate pantries, soup kitchens, and community fridges.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            Open map <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => setPage("client-upload")}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 text-left transition-colors group"
        >
          <Camera className="w-7 h-7 mb-3 text-[#2E7D32]" />
          <p className="font-semibold text-lg text-gray-900">Submit a Photo</p>
          <p className="text-sm text-gray-500 mt-1">
            Help the community by uploading a photo of pantry shelves or supplies.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-[#2E7D32] group-hover:text-[#1B5E20] transition-colors">
            Upload photo <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Recent pantries list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900 text-sm">Nearby Resources</h3>
        </div>
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {published.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.location || "Location unavailable"}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {p.ratingAverage != null && (
                    <span className="text-xs text-yellow-600 font-medium">
                      ⭐ {Number(p.ratingAverage).toFixed(1)}
                    </span>
                  )}
                  {p.waitTimeMinutesAverage != null && (
                    <span className="text-xs text-gray-400">
                      {Math.round(p.waitTimeMinutesAverage)} min wait
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="px-5 py-3 border-t border-gray-100">
          <button
            onClick={() => setPage("map")}
            className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium transition-colors"
          >
            View all on map →
          </button>
        </div>
      </div>
    </div>
  );
}
