import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Moon, Star, Sunrise, Sunset, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Home() {
  const [skyData, setSkyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkyData();
  }, []);

  const fetchSkyData = async () => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate current night sky data for Hawaii (Mauna Kea coordinates: 19.82°N, 155.47°W). 
        Return JSON with: current_date, moon_phase (name and percentage), visible_planets (array of planet names), 
        featured_constellation (name and brief description), sunset_time, sunrise_time, best_viewing_hours.`,
        response_json_schema: {
          type: "object",
          properties: {
            current_date: { type: "string" },
            moon_phase: {
              type: "object",
              properties: {
                name: { type: "string" },
                percentage: { type: "number" }
              }
            },
            visible_planets: {
              type: "array",
              items: { type: "string" }
            },
            featured_constellation: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" }
              }
            },
            sunset_time: { type: "string" },
            sunrise_time: { type: "string" },
            best_viewing_hours: { type: "string" }
          }
        }
      });
      setSkyData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sky data:", error);
      setLoading(false);
    }
  };

  if (loading) {
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
          {skyData?.current_date}
        </p>
      </div>

      {/* Moon Phase Card */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center">
              <Moon className="w-6 h-6 text-[#0A1929]" />
            </div>
            <div>
              <div className="text-2xl">{skyData?.moon_phase?.name}</div>
              <div className="text-sm text-white/60 font-normal">
                Mahina - {skyData?.moon_phase?.percentage}% illuminated
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
              <Sunset className="w-5 h-5 text-[#FFA07A]" />
              Sunset & Sunrise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunset</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunset_time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Sunrise</span>
                <span className="text-white font-semibold text-lg">{skyData?.sunrise_time}</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <span className="text-white/70 text-sm">Best Viewing</span>
                <p className="text-white mt-1">{skyData?.best_viewing_hours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-lg">
              <Star className="w-5 h-5 text-[#FFD700]" />
              Visible Tonight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-white/70 text-sm mb-3">Planets</p>
              <div className="flex flex-wrap gap-2">
                {skyData?.visible_planets?.map((planet, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] text-white text-sm font-medium"
                  >
                    {planet}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Constellation */}
      <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] border-[#FFD700]/30 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            Featured: {skyData?.featured_constellation?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 leading-relaxed">
            {skyData?.featured_constellation?.description}
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to={createPageUrl("Stars")}>
          <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-[#FFD700] mx-auto mb-3" />
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
              <Moon className="w-8 h-8 text-[#FFA07A] mx-auto mb-3" />
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
              <Navigation className="w-8 h-8 text-[#FF6B6B] mx-auto mb-3" />
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