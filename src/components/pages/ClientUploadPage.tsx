"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import ImageUpload from "@/components/ImageUpload";

export function ClientUploadPage() {
  const { setPage } = useApp();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => setPage("client-home")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">Submit a Pantry Photo</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help us understand what resources are available. Upload a clear photo of pantry shelves
          or supplies — we&apos;ll do the rest.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ImageUpload />
      </div>

      <p className="text-xs text-gray-400 text-center">
        Photos are used only to improve pantry resource visibility.
      </p>
    </div>
  );
}
