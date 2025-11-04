import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Loader2, RefreshCw, ZoomIn, ZoomOut, Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SkyMap() {
  const canvasRef = useRef(null);
  const [skyData, setSkyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const touchStartRef = useRef({ dist: 0, zoom: 1, touches: [], panStart: null });
  const isPanningRef = useRef(false);

  const { data: stars } = useQuery({
    queryKey: ['stars'],
    queryFn: () => base44.entities.Star.list(),
    initialData: [],
  });

  useEffect(() => {
    fetchSkyData();
  }, [selectedDate]);

  useEffect(() => {
    if (skyData && canvasRef.current) {
      drawPlanisphere();
    }
  }, [skyData, hoveredObject, zoomLevel, panOffset]);

  const fetchSkyData = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Pacific/Honolulu'
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a detailed star map for ${dateStr} at 9:00 PM local time in Hawaii (Mauna Kea: 19.82°N, 155.47°W).
        
        CRITICAL INSTRUCTIONS:
        - Include ONLY stars and planets that are 20° or MORE above the horizon
        - For EVERY bright star (magnitude 3.5 or brighter), include hawaiian_name
        - For stars WITH Hawaiian names, use them. For stars WITHOUT Hawaiian names, use the English name in the hawaiian_name field
        - The 'name' field should ALWAYS be the standard English star name
        
        PLANETS: Only include those visible and 20°+ above horizon with Hawaiian names:
        - Mercury: ʻUkulele
        - Venus: Hōkūloa
        - Mars: Hōkūʻula
        - Jupiter: Hōkūleʻa
        - Saturn: Makulu
        - Uranus: Heleʻekela
        - Neptune: Naholoholo
        
        CONSTELLATION LINES:
        - Use EXACT star names as they appear in the stars array 'name' field
        - Only connect stars that are both 20°+ above horizon
        
        Return JSON with:
        1. stars array (only altitude >= 20°): name, hawaiian_name, azimuth, altitude, magnitude, constellation
        2. planets array (only altitude >= 20°): name, hawaiian_name, azimuth, altitude, magnitude
        3. constellations array with Hawaiian names: name, hawaiian_name, star_connections`,
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
      setSkyData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sky data:", error);
      setLoading(false);
    }
  };

  const azAltToXY = (azimuth, altitude, canvasWidth, canvasHeight) => {
    if (altitude < 20) return null;
    
    const centerX = canvasWidth / 2 + panOffset.x;
    const centerY = canvasHeight / 2 + panOffset.y;
    const maxRadius = (Math.min(canvasWidth, canvasHeight) / 2 - 80) * zoomLevel;

    const r = maxRadius * (1 - (altitude - 20) / 70);
    const theta = (azimuth - 90) * (Math.PI / 180);

    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);

    return { x, y };
  };

  const drawPlanisphere = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    bgGradient.addColorStop(0, '#1a0b2e');
    bgGradient.addColorStop(0.5, '#16213e');
    bgGradient.addColorStop(1, '#0f0920');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const maxRadius = (Math.min(width, height) / 2 - 80) * zoomLevel;

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    const borderGradient = ctx.createLinearGradient(centerX - maxRadius, centerY, centerX + maxRadius, centerY);
    borderGradient.addColorStop(0, '#a855f7');
    borderGradient.addColorStop(0.5, '#3b82f6');
    borderGradient.addColorStop(1, '#ec4899');
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;
    [30, 45, 60, 75].forEach((alt) => {
      if (alt >= 20) {
        const r = maxRadius * (1 - (alt - 20) / 70);
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    ctx.fillStyle = '#e879f9';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    
    const labelDistance = maxRadius + 50;
    const directions = [
      { text: 'ʻĀkau', angle: 0, label: 'North' },
      { text: 'Hikina', angle: Math.PI / 2, label: 'East' },
      { text: 'Hema', angle: Math.PI, label: 'South' },
      { text: 'Komohana', angle: 3 * Math.PI / 2, label: 'West' }
    ];
    
    directions.forEach(({ text, angle, label }) => {
      const x = centerX + labelDistance * Math.cos(angle - Math.PI / 2);
      const y = centerY + labelDistance * Math.sin(angle - Math.PI / 2);
      
      ctx.fillStyle = '#e879f9';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(text, x, y);
      
      ctx.fillStyle = 'rgba(232, 121, 249, 0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText(label, x, y + 20);
    });

    if (skyData?.constellations) {
      skyData.constellations.forEach(constellation => {
        constellation.star_connections?.forEach(connection => {
          if (connection.length >= 2) {
            const star1 = skyData.stars.find(s => s.name === connection[0]);
            const star2 = skyData.stars.find(s => s.name === connection[1]);

            if (star1 && star2 && star1.altitude >= 20 && star2.altitude >= 20) {
              const pos1 = azAltToXY(star1.azimuth, star1.altitude, width, height);
              const pos2 = azAltToXY(star2.azimuth, star2.altitude, width, height);

              if (pos1 && pos2) {
                const lineGradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
                lineGradient.addColorStop(0, 'rgba(96, 165, 250, 0.4)');
                lineGradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)');
                ctx.strokeStyle = lineGradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pos1.x, pos1.y);
                ctx.lineTo(pos2.x, pos2.y);
                ctx.stroke();
              }
            }
          }
        });

        if (constellation.hawaiian_name) {
          const constellationStars = constellation.star_connections?.flat()
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(starName => skyData.stars.find(s => s.name === starName))
            .filter(s => s && s.altitude >= 20);
          
          if (constellationStars && constellationStars.length > 0) {
            let avgX = 0, avgY = 0, count = 0;
            constellationStars.forEach(s => {
              const pos = azAltToXY(s.azimuth, s.altitude, width, height);
              if (pos) {
                avgX += pos.x;
                avgY += pos.y;
                count++;
              }
            });
            
            if (count > 0) {
              avgX /= count;
              avgY /= count;
              
              ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
              ctx.font = 'italic 16px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(constellation.hawaiian_name, avgX, avgY);
            }
          }
        }
      });
    }

    skyData?.stars?.forEach(star => {
      if (star.altitude < 20) return;
      
      const pos = azAltToXY(star.azimuth, star.altitude, width, height);
      if (!pos) return;
      
      const size = Math.max(3, 12 - star.magnitude * 1.8);
      const isHovered = hoveredObject?.name === star.name;
      const isSelected = selectedObject?.name === star.name;

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 4);
      if (isHovered || isSelected) {
        gradient.addColorStop(0, 'rgba(236, 72, 153, 1)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.9)');
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = isHovered || isSelected ? '#ec4899' : '#ffffff';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      if (star.hawaiian_name && star.magnitude < 2.5) {
        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(star.hawaiian_name, pos.x + size + 8, pos.y + 5);
      }
    });

    skyData?.planets?.forEach(planet => {
      if (planet.altitude < 20) return;
      
      const pos = azAltToXY(planet.azimuth, planet.altitude, width, height);
      if (!pos) return;
      
      const size = 10;
      const isHovered = hoveredObject?.name === planet.name;
      const isSelected = selectedObject?.name === planet.name;

      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
      gradient.addColorStop(0, 'rgba(234, 179, 8, 0.9)');
      gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = isHovered || isSelected ? '#fbbf24' : '#eab308';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
      ctx.fill();

      if (planet.hawaiian_name) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(planet.hawaiian_name, pos.x + size + 8, pos.y + 5);
      }
    });

    ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.font = 'italic 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Luna Lani', centerX, centerY - 10);
    ctx.fillText('(Zenith)', centerX, centerY + 10);
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
        ],
        panStart: null
      };
      isPanningRef.current = false;
    } else if (e.touches.length === 1) {
      touchStartRef.current.panStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        offsetX: panOffset.x,
        offsetY: panOffset.y
      };
      isPanningRef.current = true;
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
      isPanningRef.current = false;
    } else if (e.touches.length === 1 && isPanningRef.current && touchStartRef.current.panStart) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - touchStartRef.current.panStart.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.panStart.y;
      setPanOffset({
        x: touchStartRef.current.panStart.offsetX + deltaX,
        y: touchStartRef.current.panStart.offsetY + deltaY
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = { dist: 0, zoom: zoomLevel, touches: [], panStart: null };
    isPanningRef.current = false;
  };

  const handleMouseDown = (e) => {
    touchStartRef.current.panStart = {
      x: e.clientX,
      y: e.clientY,
      offsetX: panOffset.x,
      offsetY: panOffset.y
    };
    isPanningRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (isPanningRef.current && touchStartRef.current.panStart) {
      const deltaX = e.clientX - touchStartRef.current.panStart.x;
      const deltaY = e.clientY - touchStartRef.current.panStart.y;
      setPanOffset({
        x: touchStartRef.current.panStart.offsetX + deltaX,
        y: touchStartRef.current.panStart.offsetY + deltaY
      });
    }
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredStar = skyData?.stars?.find(star => {
      if (star.altitude < 20) return false;
      const pos = azAltToXY(star.azimuth, star.altitude, canvas.width, canvas.height);
      if (!pos) return false;
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
    });

    if (hoveredStar) {
      setHoveredObject(hoveredStar);
      canvas.style.cursor = 'pointer';
      return;
    }

    const hoveredPlanet = skyData?.planets?.find(planet => {
      if (planet.altitude < 20) return false;
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      if (!pos) return false;
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
    });

    if (hoveredPlanet) {
      setHoveredObject(hoveredPlanet);
      canvas.style.cursor = 'pointer';
      return;
    }

    setHoveredObject(null);
    canvas.style.cursor = isPanningRef.current ? 'grabbing' : 'grab';
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleCanvasClick = (e) => {
    if (Math.abs(e.clientX - (touchStartRef.current.panStart?.x || e.clientX)) > 5) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedStar = skyData?.stars?.find(star => {
      if (star.altitude < 20) return false;
      const pos = azAltToXY(star.azimuth, star.altitude, canvas.width, canvas.height);
      if (!pos) return false;
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
    });

    if (clickedStar) {
      setSelectedObject({ ...clickedStar, type: 'star' });
      return;
    }

    const clickedPlanet = skyData?.planets?.find(planet => {
      if (planet.altitude < 20) return false;
      const pos = azAltToXY(planet.azimuth, planet.altitude, canvas.width, canvas.height);
      if (!pos) return false;
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      return distance < 20;
    });

    if (clickedPlanet) {
      setSelectedObject({ ...clickedPlanet, type: 'planet' });
      return;
    }

    setSelectedObject(null);
  };

  const changeWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

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
            <Loader2 className="w-12 h-12 text-[#a855f7] animate-spin mx-auto mb-4" />
            <p className="text-white/70">Mapping ka lani...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a855f7] via-[#3b82f6] to-[#ec4899] flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Hawaiian Planisphere
        </h1>
        <p className="text-white/70 text-lg mb-2">
          {skyData?.location} • {skyData?.date}
        </p>
        <Badge className="bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] text-white">
          {skyData?.stars?.filter(s => s.altitude >= 20).length || 0} stars • {skyData?.planets?.filter(p => p.altitude >= 20).length || 0} planets visible (20°+)
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Planisphere */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
            <CardContent className="p-4">
              {/* Info Box Above Canvas */}
              <div className="mb-4 p-3 rounded-lg bg-[#60A5FA]/20 backdrop-blur-sm border border-[#a855f7]/30">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-[#e879f9] mt-0.5 flex-shrink-0" />
                  <div className="text-white text-sm">
                    <p className="text-[#e879f9] font-semibold mb-1">Hawaiian Planisphere Guide</p>
                    <p className="mb-1">• Center = Luna Lani (Zenith)</p>
                    <p className="mb-1">• Edge = 20° horizon limit</p>
                    <p className="mb-1">• Zoom: {zoomLevel.toFixed(2)}x</p>
                    <p className="text-white/60 text-xs">Pinch/scroll to zoom • Drag to pan</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <div className="flex items-center gap-2 bg-[#60A5FA]/20 rounded-lg px-3 py-2 border border-[#a855f7]/30">
                  <Calendar className="w-4 h-4 text-[#a855f7]" />
                  <span className="text-white text-sm font-medium">
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeWeek(-1)}
                  className="border-[#a855f7]/30 text-white hover:bg-[#a855f7]/20 bg-[#60A5FA]/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeWeek(1)}
                  className="border-[#a855f7]/30 text-white hover:bg-[#a855f7]/20 bg-[#60A5FA]/10"
                >
                  Next Week
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="border-[#ec4899]/30 text-white hover:bg-[#ec4899]/20 bg-[#60A5FA]/10"
                >
                  Tonight
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                    className="border-[#3b82f6]/30 text-white hover:bg-[#3b82f6]/20 bg-[#60A5FA]/10"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                    className="border-[#3b82f6]/30 text-white hover:bg-[#3b82f6]/20 bg-[#60A5FA]/10"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSkyData}
                    className="border-white/20 text-white hover:bg-white/10 bg-[#60A5FA]/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <canvas
                ref={canvasRef}
                width={1200}
                height={1200}
                className="w-full h-auto rounded-xl border-2 border-[#a855f7]/30 cursor-grab active:cursor-grabbing"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Object Info */}
          {selectedObject && (
            <Card className="bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {selectedObject.hawaiian_name || selectedObject.name}
                    </h3>
                    <p className="text-white/60 text-sm">{selectedObject.name}</p>
                  </div>
                  <Badge className={selectedObject.type === 'planet' ? "bg-[#eab308]" : "bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white"}>
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
                      <p className="text-white/50 text-xs">Direction</p>
                      <p className="text-white">{selectedObject.azimuth.toFixed(1)}°</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Altitude</p>
                      <p className="text-white">{selectedObject.altitude.toFixed(1)}°</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Brightness</p>
                    <p className="text-white">{selectedObject.magnitude.toFixed(2)}</p>
                  </div>
                </div>

                {getDetailLink(selectedObject) && (
                  <Link to={getDetailLink(selectedObject)}>
                    <Button className="w-full bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] text-white hover:opacity-90">
                      View Full Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-white font-bold mb-3">Hōʻailona (Legend)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <span className="text-white/80">Nā Hōkū (Stars)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
                  <span className="text-white/80">Nā Hōkūhele (Planets)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-[#60a5fa] to-[#a855f7]"></div>
                  <span className="text-white/80">Star Lines</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 border-[#a855f7]/30">
            <CardContent className="p-4">
              <p className="text-white/90 italic text-sm leading-relaxed">
                This planisphere shows ka lani (the heavens) as seen from Hawaiʻi. Only stars 20° or higher above the horizon are displayed, matching traditional navigation practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}