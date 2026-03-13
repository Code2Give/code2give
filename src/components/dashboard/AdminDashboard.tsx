import React from 'react';
import { Badge } from '@/components/ui/Badge';
import ReliabilityScore from './ReliabilityScore';

export default function AdminDashboard() {
  const dummyFeedback = [
    { id: 1, text: "The line was too long, I waited for 2 hours.", sentiment: "Negative", tags: ["Wait Time"], pantry: "Downtown Hub" },
    { id: 2, text: "Fresh produce was amazing, thank you!", sentiment: "Positive", tags: ["Food Quality"], pantry: "Uptown Family Services" },
    { id: 3, text: "Hard to get there by bus with my kids.", sentiment: "Negative", tags: ["Transportation"], pantry: "Downtown Hub" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Lemontree Admin</h2>
        <div className="text-sm text-slate-500">Live AI Processing Active</div>
      </div>
      
      <p className="text-slate-600 text-lg">
        Monitor real-time qualitative feedback analyzed by Gemini to discover operational bottlenecks.
      </p>

      {/* Placeholder Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="font-medium text-slate-500 mb-1">Feedback Processed</div>
          <div className="text-3xl font-bold text-slate-900">1,245</div>
          <div className="text-sm text-slate-500 mt-2">This month</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="font-medium text-slate-500 mb-1">Top Negative Tag</div>
          <div className="text-3xl font-bold text-slate-900">Wait Time</div>
          <div className="text-sm text-red-600 mt-2 font-medium">34% of negative reviews</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="font-medium text-slate-500 mb-1">Top Positive Tag</div>
          <div className="text-3xl font-bold text-slate-900">Staff</div>
          <div className="text-sm text-green-600 mt-2 font-medium">62% of positive reviews</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="font-medium text-amber-800 mb-1">Needs Attention</div>
          <div className="text-3xl font-bold text-amber-900">2 Pantries</div>
          <div className="text-sm text-amber-700 mt-2">Reliability score &lt; 50</div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
         {/* Live Feedback Feed */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-slate-900">AI Analyzed Feedback Stream</h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {dummyFeedback.map((fb) => (
              <div key={fb.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-700">{fb.pantry}</span>
                  <Badge variant={fb.sentiment === "Negative" ? "destructive" : "default"}>
                    {fb.sentiment}
                  </Badge>
                </div>
                <p className="text-slate-800 italic mb-3">"{fb.text}"</p>
                <div className="flex gap-2">
                   {fb.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="text-xs">
                       {tag}
                     </Badge>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reliability Widget */}
        <div className="h-full">
          <ReliabilityScore />
        </div>
      </div>
    </div>
  );
}
