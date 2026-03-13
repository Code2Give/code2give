"use client";

import { usePersona } from "@/components/layout/PersonaWrapper";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import GovDashboard from "@/components/dashboard/GovDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { LayoutDashboard, Users, HeartHandshake, Settings, LogOut } from "lucide-react";

export default function Home() {
  const { role } = usePersona();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar Navigation (Morgan Stanley-grade sleek dark look) */}
      <aside className="w-64 bg-slate-950 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 font-bold text-white flex items-center justify-center shrink-0">
            LI
          </div>
          <span className="font-semibold text-slate-100 tracking-wide">InsightEngine</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-900 text-emerald-400 font-medium transition-colors">
            <LayoutDashboard size={20} />
            Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-900/50 hover:text-slate-100 transition-colors">
            <HeartHandshake size={20} />
            Impact Metrics
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-900/50 hover:text-slate-100 transition-colors">
            <Users size={20} />
            Demographics
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800/50 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-900/50 hover:text-slate-100 transition-colors">
            <Settings size={18} />
            Settings
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-900/50 hover:text-slate-100 transition-colors">
            <LogOut size={18} />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500">
             Overview / <span className="text-slate-900 ml-1">Dashboard</span>
          </div>
        </header>

        {/* Dashboard Dynamic Routing based on Persona */}
        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {role === "DONOR" && <DonorDashboard />}
            {role === "GOV" && <GovDashboard />}
            {role === "ADMIN" && <AdminDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
}
