
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Compass, Eye, EyeOff, Loader2, MapPin, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SkyMap() {
  const canvasRef = useRef(null);
  const [skyData, setSkyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showHawaiianNames, setShowHawaiianNames] = useState(true);
  const [hoveredObject, setHoveredObject] = useState(null);

  const { data: stars } = useQuery({
    queryKey: ['stars'],
    queryFn: () => base44.entities.Star.list(),
    initialData: [],
  });

  const { data: planets } = useQuery({
    queryKey: ['planets'],
    queryFn: () => base44.entities.Planet.list(),
    initialData: [],
  });

  useEffect(() => {
    fetchSkyData();
  }, []);

  useEffect(() => {
    if (skyData && canvasRef.current) {
      drawSkyMap();
    }
  }, [skyData, showConstellations, showHawaiianNames, hoveredObject]);

  const fetchSkyData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Pacific/Honolulu'
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Pacific/Honolulu'
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a detailed sky map for tonight ${dateStr} (October 31, 2025) in Hawaii (Mauna Kea: 19.82°N, 155.47°W) at ${timeStr} local time.
        
        CRITICAL: Only Saturn, Uranus, Neptune, and Pluto are visible tonight. Do NOT include Mercury, Venus, Mars, or Jupiter in the planets array.
        
        Return JSON with:
        1. An array of visible bright stars with: name, hawaiian_name (if known from: Hōkūleʻa/Arcturus, Hōkūpaʻa/Polaris, A'a/Sirius, Kauluakoko/Betelgeuse, Nānāhope/Cassiopeia, Newe/Southern Cross, Makaliʻi/Pleiades), 
           azimuth (0-360 degrees, accurate for the current date and time), altitude (0-90 degrees, accurate for current date and time), magnitude, constellation
        2. An array of visible planets - ONLY include Saturn, Uranus, Neptune, and Pluto with: name, hawaiian_name (if known), azimuth (accurate), altitude (accurate), magnitude
        3. An array of major constellation outlines visible (at least 10) with: name, star_connections (array of arrays showing which stars connect, using star names)
        4. Current time and date
        
        Include all bright stars magnitude 2.5 or brighter visible from Hawaii at this exact time.`,
        response_json_schema: {
          type: "object",
          properties: {
            date: { type: "string" },
            time: { type: "string" },
            location: { type: "string" },
            stars: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hawaiian_name: { type: "string" },
                  azimuth: { type: "number" },
                  altitude: { type: "number" },
                  magnitude: { type: "number" },
                  constellation: { type: "string" }
                }
              }
            },
            planets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  hawaiian_name: { type: "string" },
                  azimuth: { type: "number" },
                  altitude: { type: "number" },
                  magnitude: { type: "number" }
                }
              }
            },
            constellations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  star_connections: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                }
              }
            }
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

  const azAltToXY = (azimuth, altitude, canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.min(canvasWidth, canvasHeight) / 2 - 40;

    const r = maxRadius * (1 - altitude / 90);
    const theta = (azimuth - 90) * (Math.PI / 180);

    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);

    return { x, y };
  };

  const drawSkyMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0A1929';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;

    // Draw horizon circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    [30, 60, 90].forEach((alt, idx) => {
      const r = maxRadius * (1 - alt / 90);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Draw cardinal directions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ['N', 'E', 'S', 'W'].forEach((dir, idx) => {
      const angle = idx * Math.PI / 2;
      const x = centerX + (maxRadius + 20) * Math.cos(angle - Math.PI / 2);
      const y = centerY + (maxRadius + 20) * Math.sin(angle - Math.PI / 2);
      ctx.fillText(dir, x, y + 5);
    });

    // Draw constellation lines
    if (showConstellations && skyData?.constellations) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.lineWidth = 1;

      skyData.constellations.forEach(constellation => {
        constellation.star_connections?.forEach(connection => {
          if (connection.length >= 2) {
            const star1 = skyData.stars.find(s => s.name === connection[0]);
            const star2 = skyData.stars.find(s => s.name === connection[1]);

            if (star1 && star2) {
              const pos1 = azAltToXY(star1.azimuth, star1.altitude, width, height);
              const pos2 = azAltToXY(star2.azimuth, star2.altitude, width, height);

              ctx.beginPath();
              ctx.moveTo(pos1.x, pos1.y);
              ctx.lineTo(pos2.x, pos2.y);
              ctx.stroke();
            }
          }
        });
      });
    }

    // Draw stars
    skyData?.stars?.forEach(star => {
      const pos = azAltToXY(star.azimuth, star.altitude, width, height);
      const size = Math.max(2, 8 - star.magnitude * 1.5);

      const isHovered = hoveredObject?.name === star.name;
      const isSelected = selectedObject?.name === star.name;

      // Star glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
      gradient.addColorStop(0, isHovered || isSelected ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 3, 0, 2 * Math.PI);
      ctx.fill();

      // Star core
      ctx.fillStyle = isHovered || isSelected ? '#FFD700' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Labels
      if (showHawaiianNames && star.hawaiian_name) {
        ctx.fillStyle = '#FFA07A';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(star.hawaiian_name, pos.x + size + 4, pos.y - 2);
      }

      if (isHovered || isSelected) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(star.name, pos.x + size + 4, pos.y + 10);
      }
    });

    // Draw planets
    skyData?.planets?.forEach(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, width, height);
      const size = 6;

      const isHovered = hoveredObject?.name === planet.name;
      const isSelected = selectedObject?.name === planet.name;

      // Planet glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 2);
      gradient.addColorStop(0, isHovered || isSelected ? 'rgba(255, 107, 107, 0.8)' : 'rgba(255, 160, 122, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 160, 122, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 2, 0, 2 * Math.PI);
      ctx.fill();

      // Planet core
      ctx.fillStyle = isHovered || isSelected ? '#FF6B6B' : '#FFA07A';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Labels
      if (showHawaiianNames && planet.hawaiian_name) {
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(planet.hawaiian_name, pos.x + size + 4, pos.y + 4);
      } else {
        ctx.fillStyle = '#FFA07A';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(planet.name, pos.x + size + 4, pos.y + 4);
      }
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check stars
    const clickedStar = skyData?.stars?.find(star => {
      const pos = azAltToXY(star.azimuth, star.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 15;
    });

    if (clickedStar) {
      setSelectedObject({ ...clickedStar, type: 'star' });
      return;
    }

    // Check planets
    const clickedPlanet = skyData?.planets?.find(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 15;
    });

    if (clickedPlanet) {
      setSelectedObject({ ...clickedPlanet, type: 'planet' });
      return;
    }

    setSelectedObject(null);
  };

  const handleCanvasMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredStar = skyData?.stars?.find(star => {
      const pos = azAltToXY(star.azimuth, star.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 15;
    });

    if (hoveredStar) {
      setHoveredObject(hoveredStar);
      canvas.style.cursor = 'pointer';
      return;
    }

    const hoveredPlanet = skyData?.planets?.find(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 15;
    });

    if (hoveredPlanet) {
      setHoveredObject(hoveredPlanet);
      canvas.style.cursor = 'pointer';
      return;
    }

    setHoveredObject(null);
    canvas.style.cursor = 'default';
  };

  const filteredObjects = searchQuery
    ? [
        ...(skyData?.stars || []).map(s => ({ ...s, type: 'star' })),
        ...(skyData?.planets || []).map(p => ({ ...p, type: 'planet' }))
      ].filter(obj =>
        obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.hawaiian_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getDetailLink = (obj) => {
    if (obj.type === 'star') {
      const star = stars.find(s =>
        s.english_name === obj.name || s.hawaiian_name === obj.hawaiian_name
      );
      return star ? `${createPageUrl("StarDetail")}?id=${star.id}` : null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mx-auto mb-4" />
            <p className="text-white/70">Mapping the heavens...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-[#0A1929]" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Interactive Sky Map
        </h1>
        <p className="text-white/70 text-lg mb-2">
          {skyData?.location} • {skyData?.date} • {skyData?.time}
        </p>
        <Badge className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] text-white">
          {skyData?.stars?.length || 0} stars • {skyData?.planets?.length || 0} planets visible
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Sky Map */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4">
              {/* Controls */}
              <div className="flex flex-wrap gap-3 mb-4">
                <Button
                  variant={showConstellations ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowConstellations(!showConstellations)}
                  className={showConstellations ? "bg-gradient-to-r from-[#FFD700] to-[#FFA07A] text-[#0A1929]" : "border-white/20 text-white"}
                >
                  {showConstellations ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  Constellations
                </Button>
                <Button
                  variant={showHawaiianNames ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowHawaiianNames(!showHawaiianNames)}
                  className={showHawaiianNames ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] text-white" : "border-white/20 text-white"}
                >
                  {showHawaiianNames ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  Hawaiian Names
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSkyData}
                  className="border-white/20 text-white ml-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  className="w-full h-auto rounded-xl border border-white/20 bg-[#0A1929]"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
                  <p className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-[#FFD700]" />
                    Center = Zenith (overhead)
                  </p>
                  <p>Edge = Horizon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stars or planets..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {searchQuery && filteredObjects.length > 0 && (
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {filteredObjects.map((obj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedObject(obj)}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-white font-medium">{obj.hawaiian_name || obj.name}</p>
                      <p className="text-white/60 text-sm">{obj.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Object Info */}
          {selectedObject && (
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {selectedObject.hawaiian_name || selectedObject.name}
                    </h3>
                    <p className="text-white/60 text-sm">{selectedObject.name}</p>
                  </div>
                  <Badge className={selectedObject.type === 'planet' ? "bg-[#FF6B6B]" : "bg-[#FFD700] text-[#0A1929]"}>
                    {selectedObject.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedObject.constellation && (
                    <div>
                      <p className="text-white/50 text-xs">Constellation</p>
                      <p className="text-white">{selectedObject.constellation}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-white/50 text-xs">Azimuth</p>
                      <p className="text-white">{selectedObject.azimuth.toFixed(1)}°</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Altitude</p>
                      <p className="text-white">{selectedObject.altitude.toFixed(1)}°</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Magnitude</p>
                    <p className="text-white">{selectedObject.magnitude.toFixed(2)}</p>
                  </div>
                </div>

                {getDetailLink(selectedObject) && (
                  <Link to={getDetailLink(selectedObject)}>
                    <Button className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA07A] text-[#0A1929]">
                      View Full Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-white font-bold mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <span className="text-white/80">Stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFA07A]"></div>
                  <span className="text-white/80">Planets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-[#FFD700] opacity-30"></div>
                  <span className="text-white/80">Constellation Lines</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
