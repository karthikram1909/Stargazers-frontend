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

const MoonPhaseIcon = ({ phase }) => {
  const getMoonSVG = () => {
    switch(phase) {
      case "new":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="newMoonGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#newMoonGrad)" stroke="#3a3a4e" strokeWidth="1"/>
          </svg>
        );
      case "waxing-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight1" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="50%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark1" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark1)" />
            <path d="M 50 10 A 40 40 0 0 1 50 90 A 25 40 0 0 0 50 10" fill="url(#moonLight1)"/>
            <ellipse cx="60" cy="35" rx="3" ry="2" fill="#C0C0C0" opacity="0.3"/>
            <ellipse cx="58" cy="55" rx="4" ry="3" fill="#B0B0B0" opacity="0.25"/>
          </svg>
        );
      case "first-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight2" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark2" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark2)" />
            <path d="M 50 10 A 40 40 0 0 1 50 90 Q 55 50 50 10" fill="url(#moonLight2)"/>
            <ellipse cx="65" cy="30" rx="4" ry="3" fill="#A9A9A9" opacity="0.4"/>
            <ellipse cx="62" cy="50" rx="5" ry="4" fill="#999999" opacity="0.35"/>
            <ellipse cx="68" cy="65" rx="3" ry="2" fill="#B0B0B0" opacity="0.3"/>
          </svg>
        );
      case "full":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="fullMoonGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#FFFAF0" />
                <stop offset="30%" stopColor="#FFF8DC" />
                <stop offset="70%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <filter id="moonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="42" fill="#F5DEB3" opacity="0.3" filter="url(#moonGlow)"/>
            <circle cx="50" cy="50" r="40" fill="url(#fullMoonGrad)"/>
            <ellipse cx="45" cy="30" rx="6" ry="5" fill="#D3D3D3" opacity="0.4"/>
            <ellipse cx="55" cy="35" rx="4" ry="3" fill="#C0C0C0" opacity="0.35"/>
            <ellipse cx="38" cy="48" rx="7" ry="6" fill="#DCDCDC" opacity="0.45"/>
            <ellipse cx="60" cy="52" rx="5" ry="4" fill="#D0D0D0" opacity="0.4"/>
            <ellipse cx="48" cy="65" rx="6" ry="5" fill="#C8C8C8" opacity="0.38"/>
            <ellipse cx="35" cy="62" rx="3" ry="2" fill="#BEBEBE" opacity="0.3"/>
          </svg>
        );
      case "waning-gibbous":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight3" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark3" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonLight3)"/>
            <ellipse cx="38" cy="35" rx="4" ry="3" fill="#C0C0C0" opacity="0.4"/>
            <ellipse cx="30" cy="48" rx="5" ry="4" fill="#B0B0B0" opacity="0.35"/>
            <ellipse cx="42" cy="60" rx="4" ry="3" fill="#B8B8B8" opacity="0.33"/>
            <path d="M 50 10 A 40 40 0 0 0 50 90 A 25 40 0 0 1 50 10" fill="url(#moonDark3)"/>
          </svg>
        );
      case "last-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight4" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark4" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark4)" />
            <path d="M 50 10 A 40 40 0 0 0 50 90 Q 45 50 50 10" fill="url(#moonLight4)"/>
            <ellipse cx="35" cy="30" rx="4" ry="3" fill="#A9A9A9" opacity="0.4"/>
            <ellipse cx="38" cy="50" rx="5" ry="4" fill="#999999" opacity="0.35"/>
            <ellipse cx="32" cy="65" rx="3" ry="2" fill="#B0B0B0" opacity="0.3"/>
          </svg>
        );
      case "waning-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight5" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="50%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark5" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark5)" />
            <path d="M 50 10 A 40 40 0 0 0 50 90 A 25 40 0 0 1 50 10" fill="url(#moonLight5)"/>
            <ellipse cx="40" cy="35" rx="3" ry="2" fill="#C0C0C0" opacity="0.3"/>
            <ellipse cx="42" cy="55" rx="4" ry="3" fill="#B0B0B0" opacity="0.25"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="defaultMoon" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#FFFAF0" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#defaultMoon)"/>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full">
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

      {/* Moon Phases - MOVED TO TOP */}
      <div className="mb-12">
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
                      <div className="w-28 h-28 flex items-center justify-center">
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