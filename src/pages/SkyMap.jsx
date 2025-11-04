import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Compass, Eye, EyeOff, Loader2, MapPin, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef({ dist: 0, zoom: 1, touches: [] });

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
  }, [skyData, showConstellations, showHawaiianNames, hoveredObject, zoomLevel, panOffset]);

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
        prompt: `You are an expert astronomer. Generate HIGHLY ACCURATE sky map data for ${dateStr} at ${timeStr} in Hawaii (19.82°N, 155.47°W).

        CRITICAL REQUIREMENTS:
        
        1. STAR DATA - Include 20-30 bright stars (magnitude 3.0 or brighter) that are ACTUALLY visible above the horizon right now:
           - name: Use EXACT standard star names (Sirius, Vega, Betelgeuse, Rigel, Aldebaran, etc.)
           - hawaiian_name: Hawaiian name if known, otherwise repeat the English name
           - azimuth: 0-360 degrees (accurate for this date/time/location)
           - altitude: Only stars with altitude > 0 (above horizon)
           - magnitude: Actual brightness value
           - constellation: Parent constellation
        
        2. CONSTELLATION LINES - THIS IS CRITICAL:
           - For each major constellation visible tonight (Orion, Ursa Major, Cassiopeia, etc.)
           - star_connections MUST use EXACT star names that exist in your stars array
           - Example: If you include star {"name": "Rigel", ...} in stars array, use "Rigel" exactly in connections
           - Create 3-5 connections per constellation to show its shape
           - VERIFY: Every star name in connections must exist in the stars array
        
        3. PLANETS - Only include planets actually visible tonight (altitude > 0)
        
        EXAMPLE of correct constellation structure:
        {
          "name": "Orion",
          "hawaiian_name": "Kaiwikuamoʻo",
          "star_connections": [
            ["Betelgeuse", "Bellatrix"],
            ["Rigel", "Saiph"],
            ["Bellatrix", "Mintaka"]
          ]
        }
        
        Make sure EVERY star name in star_connections appears in your stars array.`,
        add_context_from_internet: true,
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
                  hawaiian_name: { type: "string" },
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
      
      console.log("=== SKY MAP DATA ===");
      console.log("Stars:", result?.stars?.length);
      console.log("Constellations:", result?.constellations?.length);
      console.log("Star names:", result?.stars?.map(s => s.name));
      
      result?.constellations?.forEach(c => {
        console.log(`${c.name} connections:`, c.star_connections);
      });
      
      setSkyData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sky data:", error);
      setLoading(false);
    }
  };

  const azAltToXY = (azimuth, altitude, canvasWidth, canvasHeight) => {
    const centerX = canvasWidth / 2 + panOffset.x;
    const centerY = canvasHeight / 2 + panOffset.y;
    const maxRadius = (Math.min(canvasWidth, canvasHeight) / 2 - 60) * zoomLevel;

    // Map altitude: 90° (zenith) at top, 0° (horizon) at edge
    const r = maxRadius * (1 - altitude / 90);
    
    // Rotate so North is at top (azimuth 0° points up)
    const theta = (azimuth) * (Math.PI / 180);

    const x = centerX + r * Math.sin(theta);
    const y = centerY - r * Math.cos(theta);

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

    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const maxRadius = (Math.min(width, height) / 2 - 60) * zoomLevel;

    // Draw horizon circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    [30, 60, 90].forEach((alt) => {
      const r = maxRadius * (1 - alt / 90);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Draw cardinal directions with N at top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    
    // N at top (0°), E at right (90°), S at bottom (180°), W at left (270°)
    const directions = [
      { label: 'N', angle: 0 },
      { label: 'E', angle: 90 },
      { label: 'S', angle: 180 },
      { label: 'W', angle: 270 }
    ];
    
    directions.forEach(({ label, angle }) => {
      const theta = angle * (Math.PI / 180);
      const x = centerX + (maxRadius + 35) * Math.sin(theta);
      const y = centerY - (maxRadius + 35) * Math.cos(theta);
      ctx.fillText(label, x, y + 7);
    });

    // Draw constellation lines
    if (showConstellations && skyData?.constellations) {
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
      ctx.lineWidth = 2;

      let linesDrawn = 0;
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
              linesDrawn++;
            }
          }
        });

        if (showHawaiianNames && constellation.hawaiian_name) {
          const constellationStars = constellation.star_connections?.flat().filter((v, i, a) => a.indexOf(v) === i)
            .map(starName => skyData.stars.find(s => s.name === starName))
            .filter(s => s);
          
          if (constellationStars && constellationStars.length > 0) {
            const avgX = constellationStars.reduce((sum, s) => {
              const pos = azAltToXY(s.azimuth, s.altitude, width, height);
              return sum + pos.x;
            }, 0) / constellationStars.length;
            
            const avgY = constellationStars.reduce((sum, s) => {
              const pos = azAltToXY(s.azimuth, s.altitude, width, height);
              return sum + pos.y;
            }, 0) / constellationStars.length;

            ctx.fillStyle = 'rgba(96, 165, 250, 0.8)';
            ctx.font = 'italic 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(constellation.hawaiian_name, avgX, avgY);
          }
        }
      });
      
      console.log(`Drew ${linesDrawn} constellation lines`);
    }

    // Draw stars
    skyData?.stars?.forEach(star => {
      const pos = azAltToXY(star.azimuth, star.altitude, width, height);
      const size = Math.max(3, 10 - star.magnitude * 1.5);

      const isHovered = hoveredObject?.name === star.name;
      const isSelected = selectedObject?.name === star.name;

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
      gradient.addColorStop(0, isHovered || isSelected ? 'rgba(96, 165, 250, 0.9)' : 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = isHovered || isSelected ? '#60A5FA' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      if (showHawaiianNames && star.hawaiian_name && star.magnitude < 2.5) {
        ctx.fillStyle = '#60A5FA';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(star.hawaiian_name, pos.x + size + 6, pos.y + 5);
      }
    });

    // Draw planets
    skyData?.planets?.forEach(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, width, height);
      const size = 8;

      const isHovered = hoveredObject?.name === planet.name;
      const isSelected = selectedObject?.name === planet.name;

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 2.5);
      gradient.addColorStop(0, isHovered || isSelected ? 'rgba(59, 130, 246, 0.9)' : 'rgba(96, 165, 250, 0.7)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 2.5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = isHovered || isSelected ? '#3B82F6' : '#60A5FA';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      if (planet.hawaiian_name) {
        ctx.fillStyle = '#3B82F6';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(planet.hawaiian_name, pos.x + size + 6, pos.y + 5);
      }
    });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      touchStartRef.current = {
        dist,
        zoom: zoomLevel,
        touches: [
          { x: touch1.clientX, y: touch1.clientY },
          { x: touch2.clientX, y: touch2.clientY }
        ]
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      const scale = dist / touchStartRef.current.dist;
      const newZoom = Math.max(0.5, Math.min(3, touchStartRef.current.zoom * scale));
      setZoomLevel(newZoom);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = { dist: 0, zoom: zoomLevel, touches: [] };
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedStar = skyData?.stars?.find(star => {
      const pos = azAltToXY(star.azimuth, star.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
    });

    if (clickedStar) {
      setSelectedObject({ ...clickedStar, type: 'star' });
      return;
    }

    const clickedPlanet = skyData?.planets?.find(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
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
      return distance < 20;
    });

    if (hoveredStar) {
      setHoveredObject(hoveredStar);
      canvas.style.cursor = 'pointer';
      return;
    }

    const hoveredPlanet = skyData?.planets?.find(planet => {
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
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
            <Loader2 className="w-12 h-12 text-[#60A5FA] animate-spin mx-auto mb-4" />
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Interactive Sky Map
        </h1>
        <p className="text-white/70 text-lg mb-2">
          {skyData?.location} • {skyData?.date} • {skyData?.time}
        </p>
        <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white">
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
                  className={showConstellations ? "bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] text-white" : "bg-[#60A5FA]/20 border-[#60A5FA]/40 text-white hover:bg-[#60A5FA]/30"}
                >
                  {showConstellations ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  Constellations
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                  className="bg-[#60A5FA]/20 border-[#60A5FA]/40 text-white hover:bg-[#60A5FA]/30"
                >
                  <ZoomOut className="w-4 h-4 mr-2" />
                  Zoom Out
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                  className="bg-[#60A5FA]/20 border-[#60A5FA]/40 text-white hover:bg-[#60A5FA]/30"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSkyData}
                  className="bg-[#60A5FA]/20 border-[#60A5FA]/40 text-white hover:bg-[#60A5FA]/30 ml-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={1200}
                  className="w-full h-auto rounded-xl border border-white/20 bg-[#0A1929]"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                {/* Zenith indicator */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">
                  ↑ Zenith (Overhead)
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 p-4 bg-black/30 backdrop-blur-sm rounded-lg text-white text-sm border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-white/80">North at Top</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-white/80">Edge = Horizon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-white/80">Zoom: {zoomLevel.toFixed(2)}x</span>
                  </div>
                  <div className="text-white/60 text-xs flex items-center">
                    📱 Pinch to zoom on mobile
                  </div>
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
                  <Badge className={selectedObject.type === 'planet' ? "bg-[#3B82F6]" : "bg-[#60A5FA] text-white"}>
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
                    <Button className="w-full bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] text-white">
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
                  <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
                  <span className="text-white/80">Planets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-[#60A5FA] opacity-50"></div>
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