import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Moon, Star, Sunrise, Sunset, Navigation, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MoonPhaseIcon from "../components/MoonPhaseIcon";

// Accurate moon phase calculation using cosine formula
const calculateMoonPhase = (date = new Date()) => {
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const lunarCycle = 29.53058867;
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const currentCycle = daysSinceNewMoon % lunarCycle;
  const normalizedCycle = currentCycle < 0 ? currentCycle + lunarCycle : currentCycle;

  const angle = (normalizedCycle / lunarCycle) * 2 * Math.PI;
  const illumination = Math.round((1 - Math.cos(angle)) / 2 * 100);
  
  let phaseName;
  let phaseType;
  
  if (normalizedCycle < 1.84566 || normalizedCycle >= 27.68492) {
    phaseName = "New Moon";
    phaseType = "new";
  } else if (normalizedCycle < 7.38264) {
    phaseName = "Waxing Crescent";
    phaseType = "waxing-crescent";
  } else if (normalizedCycle < 9.22830) {
    phaseName = "First Quarter";
    phaseType = "first-quarter";
  } else if (normalizedCycle < 13.76528) {
    phaseName = "Waxing Gibbous";
    phaseType = "waxing-gibbous";
  } else if (normalizedCycle < 15.76528) {
    phaseName = "Full Moon";
    phaseType = "full";
  } else if (normalizedCycle < 22.14792) {
    phaseName = "Waning Gibbous";
    phaseType = "waning-gibbous";
  } else if (normalizedCycle < 23.99358) {
    phaseName = "Last Quarter";
    phaseType = "last-quarter";
  } else {
    phaseName = "Waning Crescent";
    phaseType = "waning-crescent";
  }
  
  return {
    name: phaseName,
    percentage: illumination,
    type: phaseType
  };
};

export default function Home() {
  const [moonPhase, setMoonPhase] = useState(null);

  useEffect(() => {
    const phase = calculateMoonPhase();
    setMoonPhase(phase);
  }, []);

  // Fetch featured constellation with proper caching
  const { data: featuredConstellation } = useQuery({
    queryKey: ['featuredConstellation'],
    queryFn: async () => {
      const constellations = await base44.entities.Constellation.list();
      const orion = constellations.find(c => c.english_name === 'Orion');
      return orion || constellations[0];
    },
    staleTime: 60 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
  });

  // Fetch sunset/sunrise data
  const { data: skyData, isLoading: isLoadingSkyData } = useQuery({
    queryKey: ['skyData', new Date().toDateString()],
    queryFn: async () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Pacific/Honolulu'
      });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `What are the sunset and sunrise times for Hawaii on ${dateStr}? Also suggest the best hours for stargazing tonight. Be concise.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            current_date: { type: "string" },
            sunset_time: { type: "string" },
            sunrise_time: { type: "string" },
            best_viewing_hours: { type: "string" }
          }
        }
      });
      
      return result;
    },
    staleTime: 2 * 60 * 60 * 1000,
    cacheTime: 4 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  if (!moonPhase) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white/10 rounded-3xl" />
          <div className="h-64 bg-white/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Tonight's Sky
        </h1>
        <p className="text-xl text-white/70">
          {skyData?.current_date || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Pacific/Honolulu'
          })}
        </p>
      </div>

      {/* Moon Phase Card */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-16 h-16 flex items-center justify-center">
              <MoonPhaseIcon phase={moonPhase.type} />
            </div>
            <div>
              <div className="text-2xl">{moonPhase.name}</div>
              <div className="text-sm text-white/60 font-normal">
                Mahina - {moonPhase.percentage}% illuminated
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Sunset & Sunrise Card */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-lg">
            <Sunset className="w-5 h-5 text-[#60A5FA]" />
            Sunset & Sunrise
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSkyData ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-white/10 rounded" />
              <div className="h-6 bg-white/10 rounded" />
              <div className="h-12 bg-white/10 rounded" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunset</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunset_time || "6:00 PM"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunrise</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunrise_time || "6:30 AM"}</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-white/70 text-sm">Best Viewing</span>
                <p className="text-white mt-1">{skyData?.best_viewing_hours || "9 PM - 4 AM"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Constellation */}
      {featuredConstellation && (
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] border-[#60A5FA]/30 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#60A5FA]" />
              <span className="text-white/70 text-sm uppercase tracking-wide">Featured Constellation</span>
            </div>
            <CardTitle className="text-white text-2xl">
              <div className="mb-1">{featuredConstellation.hawaiian_name}</div>
              <div className="text-xl text-white/70">
                {featuredConstellation.english_name}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 leading-relaxed text-base">
              {featuredConstellation.meaning}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to={createPageUrl("Stars")}>
          <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-[#0EA5E9] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Star Guide</h3>
              <p className="text-white/60 text-sm">
                Learn Hawaiian star names
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl("Moon")}>
          <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <Moon className="w-8 h-8 text-[#60A5FA] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Moon Calendar</h3>
              <p className="text-white/60 text-sm">
                Hawaiian lunar months
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl("Wayfinding")}>
          <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <Navigation className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Wayfinding</h3>
              <p className="text-white/60 text-sm">
                Navigation traditions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}