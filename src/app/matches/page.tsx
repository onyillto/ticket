"use client";

import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import { matches, Stage } from "@/lib/data";
import { Filter } from "lucide-react";

const stages: (Stage | "All")[] = [
  "All", "Group Stage", "Round of 16", "Quarter-Final", "Semi-Final", "Final",
];

export default function MatchesPage() {
  const [selectedStage, setSelectedStage] = useState<Stage | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = matches.filter((m) => {
    const matchesStage = selectedStage === "All" || m.stage === selectedStage;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.homeTeam.toLowerCase().includes(q) ||
      m.awayTeam.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.venue.toLowerCase().includes(q);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">All Matches</h1>
        <p className="text-gray-400 mt-1">{matches.length} matches across 16 host cities</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search teams, venues, cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#cc0000]/50 focus:ring-1 focus:ring-[#cc0000]/20"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 shrink-0" />
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                selectedStage === stage
                  ? "bg-[#cc0000] text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">⚽</p>
          <p className="text-gray-900 font-bold text-lg">No matches found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-5">
            {filtered.length} match{filtered.length !== 1 ? "es" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
