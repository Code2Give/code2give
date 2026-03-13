"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ImpactMap() {
  const [layer, setLayer] = useState<"pantry" | "poverty">("pantry");

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[500px]">
      {/* Map Control Header */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between z-10">
        <div>
          <h3 className="font-semibold text-slate-900">NYC Impact Layer</h3>
          <p className="text-sm text-slate-500">Toggle data overlays for deeper decision intelligence.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <Button 
            variant={layer === "pantry" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayer("pantry")}
            className="rounded-md"
          >
            Pantry Density
          </Button>
          <Button 
            variant={layer === "poverty" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayer("poverty")}
            className="rounded-md"
          >
            Poverty SNAP Need
          </Button>
        </div>
      </div>
      
      {/* Map Container - Conceptual Placeholder */}
      <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {/* Decorative Grid Lines to simulate map styling */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-xl max-w-sm text-center relative z-10 transition-all duration-300">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${layer === 'pantry' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">
            {layer === "pantry" ? "Lemontree Pantries" : "Census SNAP Need"}
          </h4>
          <p className="text-sm text-slate-600">
            {layer === "pantry" 
              ? "Displaying density clusters of currently active supply centers connected to Lemontree." 
              : "Heatmap visualizing highest concentration of SNAP recipients and food insecurity."}
          </p>
          <div className="mt-4 text-xs font-mono text-slate-400">
            [Awaiting Mapbox / Google Maps SDK injection]
          </div>
        </div>
      </div>
    </div>
  );
}
