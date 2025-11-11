import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Moon, Star, Sunrise, Sunset, Navigation, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MoonPhaseIcon from "../components/MoonPhaseIcon";

// Accurate moon phase calculation using cosine formula
const calculateMoonPhase = (date = new Date()) => {
  // Known new moon date: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const lunarCycle = 29.53058867; // average synodic month length in days
  
  // Calculate days since known new moon in UTC
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in lunar cycle (0 to lunarCycle)
  const currentCycle = daysSinceNewMoon % lunarCycle;
  
  // Normalize currentCycle to be positive if negative
  const normalizedCycle = currentCycle < 0 ? currentCycle + lunarCycle : currentCycle;

  // Calculate illumination percentage using accurate cosine formula
  // This matches the actual illumination curve of the moon
  const angle = (normalizedCycle / lunarCycle) * 2 * Math.PI;
  const illumination = Math.round((1 - Math.cos(angle)) / 2 * 100);
  
  // Determine phase name based on cycle position
  let phaseName;
  let phaseType; // For the icon component
  
  if (normalizedCycle < 1.84566) {
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
    // Calculate accurate moon phase locally
    const phase = calculateMoonPhase();
    setMoonPhase(phase);
  }, []);

  // Fetch all planets with proper caching
  const { data: allPlanets = [], isLoading: isLoadingPlanets } = useQuery({
    queryKey: ['planets'],
    queryFn: async () => {
      const planets = await base44.entities.Planet.list();
      return planets;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Fetch featured constellation with proper caching
  const { data: featuredConstellation } = useQuery({
    queryKey: ['featuredConstellation'],
    queryFn: async () => {
      const constellations = await base44.entities.Constellation.list();
      // Find Orion (Ka Heihei o nā Keiki) or get first constellation
      const orion = constellations.find(c => c.english_name === 'Orion');
      return orion || constellations[0];
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // Keep in cache for 2 hours
  });

  // Fetch sky data with improved prompt and proper caching
  const { data: skyData, isLoading: isLoadingSkyData } = useQuery({
    queryKey: ['skyData', new Date().toDateString()], // Key changes daily
    queryFn: async () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Pacific/Honolulu'
      });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an astronomy expert. For Hawaii (Mauna Kea: 19.82°N, 155.47°W) on ${dateStr}:

CRITICAL INSTRUCTIONS:
1. Use REAL astronomical data from reliable sources to determine which planets are ACTUALLY visible tonight after sunset
2. A planet is ONLY visible if it is above the horizon during nighttime hours (after sunset, before sunrise)
3. Research current planetary positions and visibility for this EXACT date
4. Do NOT guess - use actual astronomical data
5. If a planet is too close to the Sun or below the horizon at night, do NOT include it

Planet name mappings (use these EXACT names):
- Mercury: ʻUkulele
- Venus: Hōkūloa  
- Mars: Hōkūʻula
- Jupiter: Kaʻāwela
- Saturn: Makulu
- Uranus: Heleʻekela
- Neptune: Naholoholo

Return accurate data for:
- Which planets are truly visible tonight (research this carefully)
- Actual sunset/sunrise times for Hawaii on this date
- Best viewing hours

IMPORTANT: Only include planets that are actually visible tonight. If uncertain, research current sky conditions for Hawaii.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            current_date: { type: "string" },
            visible_planets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  english_name: { type: "string" },
                  hawaiian_name: { type: "string" }
                },
                required: ["english_name", "hawaiian_name"]
              }
            },
            sunset_time: { type: "string" },
            sunrise_time: { type: "string" },
            best_viewing_hours: { type: "string" }
          },
          required: ["current_date", "visible_planets", "sunset_time", "sunrise_time", "best_viewing_hours"]
        }
      });
      
      return result;
    },
    staleTime: 2 * 60 * 60 * 1000, // Cache for 2 hours (sky doesn't change that fast)
    cacheTime: 4 * 60 * 60 * 1000, // Keep in cache for 4 hours
    refetchOnWindowFocus: false, // Don't refetch when switching tabs
    refetchOnMount: false, // Don't refetch on component remount
  });

  // Match visible planets with database planets using useMemo to prevent recalculation
  const visiblePlanetsWithIds = useMemo(() => {
    if (!skyData?.visible_planets || !allPlanets.length) return [];
    
    return skyData.visible_planets
      .map(visiblePlanet => {
        const matchedPlanet = allPlanets.find(p => 
          p.english_name.toLowerCase().trim() === visiblePlanet.english_name.toLowerCase().trim()
        );
        return {
          ...visiblePlanet,
          id: matchedPlanet?.id,
          image_url: matchedPlanet?.image_url
        };
      })
      .filter(planet => planet.id); // Only include planets we found in database
  }, [skyData?.visible_planets, allPlanets]);

  const isLoading = isLoadingPlanets || isLoadingSkyData || !moonPhase;

  if (isLoading) {
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

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-lg">
              <Sunset className="w-5 h-5 text-[#60A5FA]" />
              Sunset & Sunrise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunset</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunset_time || "Loading..."}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunrise</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunrise_time || "Loading..."}</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-white/70 text-sm">Best Viewing</span>
                <p className="text-white mt-1">{skyData?.best_viewing_hours || "Loading..."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-lg">
              <Star className="w-5 h-5 text-[#0EA5E9]" />
              Visible Tonight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-white/70 text-sm mb-3">Planets</p>
              {visiblePlanetsWithIds.length === 0 ? (
                <p className="text-white/60 text-sm">Loading planet visibility...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {visiblePlanetsWithIds.map((planet) => (
                    <Link
                      key={planet.id}
                      to={`${createPageUrl("PlanetDetail")}?id=${planet.id}`}
                      className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500 text-white text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-105 cursor-pointer"
                    >
                      <div className="font-bold">{planet.hawaiian_name}</div>
                      <div className="text-xs opacity-80">{planet.english_name}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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