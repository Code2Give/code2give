"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// The Stakeholder roles available in the system
export type PersonaRole = "DONOR" | "GOV" | "ADMIN";

interface PersonaContextType {
  role: PersonaRole;
  setRole: (role: PersonaRole) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  // Defaulting to "DONOR" for the initial view
  const [role, setRole] = useState<PersonaRole>("DONOR");

  return (
    <PersonaContext.Provider value={{ role, setRole }}>
      <div className="min-h-screen flex flex-col">
        {/* Development persona switcher banner */}
        <div className="bg-slate-900 text-slate-100 p-2 text-sm flex items-center justify-between z-50">
          <div className="font-semibold">
            Lemontree InsightEngine - Dev Mode
          </div>
          <div className="flex items-center gap-2">
            <span>Current Persona:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as PersonaRole)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DONOR">Donor</option>
              <option value="GOV">Gov (City Planner)</option>
              <option value="ADMIN">Admin (Lemontree)</option>
            </select>
          </div>
        </div>
        
        {/* Main Application Content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </PersonaContext.Provider>
  );
}

// Hook for accessing the current persona anywhere in the squad architecture
export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
}
