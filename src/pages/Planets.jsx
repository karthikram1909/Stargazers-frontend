
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Eye, EyeOff, Sparkles, Volume2 } from "lucide-react";

export default function Planets() {
  const [visibilityData, setVisibilityData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: planets } = useQuery({
    queryKey: ['planets'],
    queryFn: () => base44.entities.Planet.list(),
    initialData: [],
  });

  useEffect(() => {
    fetchVisibility();
  }, []);

  const fetchVisibility = async () => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Pacific/Honolulu'
      });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `For tonight ${dateStr} (October 31, 2025) in Hawaii (Mauna Kea: 19.82°N, 155.47°W), provide current visibility information for all planets.
        
        CRITICAL: Only Saturn, Uranus, Neptune, and Pluto are visible tonight. Mercury, Venus, Mars, and Jupiter are NOT visible.
        
        For Saturn, Uranus, Neptune, and Pluto - set visible: true with accurate data
        For Mercury, Venus, Mars, and Jupiter - set visible: false, visibility_quality: "not_visible"
        
        For each planet, include: 
        - visible (true/false)
        - visibility_quality (excellent/good/fair/poor/not_visible)
        - best_viewing_time (time of night, or "Not visible" if not visible)
        - magnitude (brightness)
        - constellation (where to find it, or "N/A" if not visible)
        - rise_time (use actual times for Hawaii on October 31, 2025, or "N/A")
        - set_time (use actual times for Hawaii on October 31, 2025, or "N/A")`,
        response_json_schema: {
          type: "object",
          properties: {
            date: { type: "string" },
            planets: {
              type: "object",
              properties: {
                Mercury: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Venus: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Mars: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Jupiter: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Saturn: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Uranus: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Neptune: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                },
                Pluto: {
                  type: "object",
                  properties: {
                    visible: { type: "boolean" },
                    visibility_quality: { type: "string" },
                    best_viewing_time: { type: "string" },
                    magnitude: { type: "number" },
                    constellation: { type: "string" },
                    rise_time: { type: "string" },
                    set_time: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });
      setVisibilityData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching visibility:", error);
      setLoading(false);
    }
  };

  const playPronunciation = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getPlanetInfo = (englishName) => {
    return planets.find(p => p.english_name === englishName);
  };

  const getVisibilityColor = (quality) => {
    const colors = {
      excellent: "bg-green-500",
      good: "bg-blue-500",
      fair: "bg-yellow-500",
      poor: "bg-orange-500",
      not_visible: "bg-gray-500"
    };
    return colors[quality] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white/10 rounded-3xl" />
          <div className="h-96 bg-white/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  const visiblePlanets = visibilityData?.planets 
    ? Object.entries(visibilityData.planets).filter(([_, data]) => data.visible)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFA07A] flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Nā Hōkūhele - The Wandering Stars
        </h1>
        <p className="text-white/70 text-lg">
          Planets visible tonight • {visibilityData?.date}
        </p>
        <div className="mt-4">
          <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA07A] text-[#0A1929] text-lg px-4 py-2">
            {visiblePlanets.length} planets visible tonight
          </Badge>
        </div>
      </div>

      {/* Tonight's Visible Planets */}
      {visiblePlanets.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#FFD700]" />
            Visible Tonight
          </h2>
          <div className="space-y-4">
            {visiblePlanets.map(([planetName, data]) => {
              const planetInfo = getPlanetInfo(planetName);
              return (
                <Card
                  key={planetName}
                  className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center flex-shrink-0">
                          <Globe className="w-7 h-7 text-[#0A1929]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-white text-2xl">
                              {planetInfo?.hawaiian_name || planetName}
                            </CardTitle>
                            {planetInfo?.pronunciation_audio_url && (
                              <button
                                onClick={() => playPronunciation(planetInfo.pronunciation_audio_url)}
                                className="text-[#FFD700] hover:text-[#FFA07A] transition-colors"
                                title="Play pronunciation"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <p className="text-white/60 mb-2">{planetName}</p>
                          {planetInfo?.meaning && (
                            <p className="text-[#FFA07A] text-sm italic">
                              {planetInfo.meaning}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getVisibilityColor(data.visibility_quality)} text-white`}>
                          {data.visibility_quality}
                        </Badge>
                        <Badge variant="outline" className="border-white/30 text-white">
                          Mag {data.magnitude}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Best Viewing
                        </p>
                        <p className="text-white font-semibold">
                          {data.best_viewing_time}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="text-white font-semibold">
                          {data.constellation}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Rise/Set
                        </p>
                        <p className="text-white font-semibold">
                          {data.rise_time} - {data.set_time}
                        </p>
                      </div>
                    </div>
                    
                    {planetInfo?.description && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/80 leading-relaxed">
                          {planetInfo.description}
                        </p>
                      </div>
                    )}

                    {planetInfo?.mythology && (
                      <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-[#1E3A5F]/50 to-[#0A1929]/50 border border-[#FFD700]/20">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Hawaiian Mythology
                        </p>
                        <p className="text-white/90 italic leading-relaxed">
                          {planetInfo.mythology}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Planets Reference */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-white/70" />
          Complete Planet Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planets.map((planet) => {
            const visibility = visibilityData?.planets?.[planet.english_name];
            const isVisible = visibility?.visible;
            
            return (
              <Card
                key={planet.id}
                className={`bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm ${
                  !isVisible ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-white text-lg">
                          {planet.hawaiian_name}
                        </CardTitle>
                        {planet.pronunciation_audio_url && (
                          <button
                            onClick={() => playPronunciation(planet.pronunciation_audio_url)}
                            className="text-[#FFD700] hover:text-[#FFA07A] transition-colors"
                            title="Play pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{planet.english_name}</p>
                    </div>
                    {isVisible ? (
                      <Eye className="w-5 h-5 text-[#FFD700]" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white/30" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {planet.meaning && (
                    <p className="text-white/70 text-sm mb-2">
                      {planet.meaning}
                    </p>
                  )}
                  {!isVisible && visibility && (
                    <Badge variant="outline" className="border-white/20 text-white/60 mt-2">
                      Not visible tonight
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Note */}
      <Card className="mt-12 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FFA07A]/20 border-[#FFA07A]/30">
        <CardContent className="p-6">
          <p className="text-white/90 italic leading-relaxed">
            Ancient Hawaiians called planets "hōkūhele" meaning "wandering stars" because they moved 
            against the fixed backdrop of stars. These celestial wanderers were observed closely and 
            incorporated into navigation, agriculture, and cultural practices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
