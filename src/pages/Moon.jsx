import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Moon as MoonIcon, Search } from "lucide-react";

const lunarMonths = [
  { name: "Makaliʻi", meaning: "Eyes of the Chief", description: "November-December. A time of cool weather and calm seas." },
  { name: "Kaʻelo", meaning: "The Moisture", description: "December-January. Season of rain and growth." },
  { name: "Kaulua", meaning: "Two Placed Together", description: "January-February. A time of twin blessings." },
  { name: "Nana", meaning: "Spring", description: "February-March. Plants begin to blossom." },
  { name: "Welo", meaning: "Dark Red", description: "March-April. Red earth exposed by spring rains." },
  { name: "Ikiiki", meaning: "Little", description: "April-May. A short month of transition." },
  { name: "Kaʻaona", meaning: "The Whistling", description: "May-June. Whistling trade winds." },
  { name: "Hilinehu", meaning: "Held Down by Fog", description: "June-July. Misty summer mornings." },
  { name: "Hilinaehu", meaning: "Held Down by Moisture", description: "July-August. Humid season begins." },
  { name: "Hilinama", meaning: "Held Down by Dew", description: "August-September. Heavy dew falls." },
  { name: "Ikuā", meaning: "Strong", description: "September-October. Strong winds and high seas." },
  { name: "Welehu", meaning: "Dark Red Skin", description: "October-November. Reddish hue in the sky." },
];

const moonPhases = [
  { 
    day: "1-3", 
    name: "Hilo", 
    meaning: "New Moon", 
    description: "Time for new beginnings and planning.",
    phase: "new"
  },
  { 
    day: "4-7", 
    name: "Hoaka", 
    meaning: "Crescent", 
    description: "Time to plant and start projects.",
    phase: "waxing-crescent"
  },
  { 
    day: "8-11", 
    name: "Māhealani", 
    meaning: "Full Moon Near", 
    description: "Preparation and growth.",
    phase: "first-quarter"
  },
  { 
    day: "12-15", 
    name: "Poepoe", 
    meaning: "Round", 
    description: "Full moon - time for gathering and celebration.",
    phase: "full"
  },
  { 
    day: "16-19", 
    name: "Olekūkahi", 
    meaning: "Waning", 
    description: "Time to harvest and complete projects.",
    phase: "waning-gibbous"
  },
  { 
    day: "20-24", 
    name: "Kaloa", 
    meaning: "Long", 
    description: "Rest and reflection period.",
    phase: "last-quarter"
  },
  { 
    day: "25-30", 
    name: "Muku", 
    meaning: "Cut Off", 
    description: "Dark moon - time for rest and introspection.",
    phase: "waning-crescent"
  },
];

// SVG Moon Phase Component
const MoonPhaseIcon = ({ phase }) => {
  const getMoonSVG = () => {
    switch(phase) {
      case "new":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case "waxing-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 5 A 45 45 0 0 1 50 95 A 35 35 0 0 0 50 5" fill="currentColor"/>
          </svg>
        );
      case "first-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 5 A 45 45 0 0 1 50 95 Z" fill="currentColor"/>
          </svg>
        );
      case "full":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case "waning-gibbous":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 5 A 45 45 0 0 0 50 95 A 35 35 0 0 1 50 5" fill="currentColor" opacity="0.3"/>
          </svg>
        );
      case "last-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 5 A 45 45 0 0 0 50 95 Z" fill="currentColor"/>
          </svg>
        );
      case "waning-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 5 A 45 45 0 0 0 50 95 A 35 35 0 0 1 50 5" fill="currentColor"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full text-white">
      {getMoonSVG()}
    </div>
  );
};

export default function Moon() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMonths = lunarMonths.filter(month => {
    const query = searchQuery.toLowerCase();
    return (
      month.name.toLowerCase().includes(query) ||
      month.meaning.toLowerCase().includes(query) ||
      month.description.toLowerCase().includes(query)
    );
  });

  const filteredPhases = moonPhases.filter(phase => {
    const query = searchQuery.toLowerCase();
    return (
      phase.name.toLowerCase().includes(query) ||
      phase.meaning.toLowerCase().includes(query) ||
      phase.description.toLowerCase().includes(query) ||
      phase.day.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center mx-auto mb-4">
          <MoonIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Mahina - Hawaiian Lunar Calendar
        </h1>
        <p className="text-white/70 text-lg">
          Ancient timekeeping by the moon
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search lunar months and phases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm h-12 text-lg"
          />
        </div>
      </div>

      {/* Lunar Months */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Nā Malama - The Months
        </h2>
        {filteredMonths.length === 0 ? (
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">No lunar months found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMonths.map((month, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-105 transition-all"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">
                    {month.name}
                  </CardTitle>
                  <p className="text-[#60A5FA] text-sm">{month.meaning}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{month.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Moon Phases */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Nā Pō o ka Mahina - Moon Phases
        </h2>
        {filteredPhases.length === 0 ? (
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">No moon phases found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPhases.map((phase, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center p-2">
                        <MoonPhaseIcon phase={phase.phase} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg">
                          {phase.name}
                        </h3>
                        <span className="text-white/50 text-sm">Days {phase.day}</span>
                      </div>
                      <p className="text-[#60A5FA] text-sm mb-2">
                        {phase.meaning}
                      </p>
                      <p className="text-white/70 text-sm">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cultural Note */}
      <Card className="mt-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 border-[#60A5FA]/30">
        <CardContent className="p-6">
          <p className="text-white/90 italic leading-relaxed">
            "The Hawaiian people used the phases of the moon to guide fishing, farming, and cultural practices. 
            Each night of the lunar month had its own name and significance, creating a detailed calendar 
            that connected daily life with the rhythms of nature."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}