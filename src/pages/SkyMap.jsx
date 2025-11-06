import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RotateCw, Loader2 } from "lucide-react";

export default function SkyMap() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [starChartUrl, setStarChartUrl] = useState(null);
  const [overlayUrl, setOverlayUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);
  const dragStartRef = useRef({ angle: 0, x: 0, y: 0 });

  // Generate planisphere images on mount
  useEffect(() => {
    generatePlanisphereImages();
  }, []);

  const generatePlanisphereImages = async () => {
    setLoading(true);
    try {
      // Generate base star chart for Hawaiian latitude (20°N)
      const starChartPrompt = `Create a detailed circular star chart for Hawaiian latitude (20°N) showing:
      - All visible stars and constellations from Hawaii
      - The celestial equator
      - Concentric circles every 10 degrees from horizon (0°) to zenith (90°)
      - Cardinal directions marked (N, S, E, W)
      - Hawaiian constellation patterns prominently displayed
      - Dark blue/black background with white/yellow stars
      - Professional astronomical chart style
      - Circular format, suitable for a planisphere base map
      - Stars sized by brightness/magnitude
      - Clear, high contrast for visibility`;

      const starChart = await base44.integrations.Core.GenerateImage({
        prompt: starChartPrompt
      });
      setStarChartUrl(starChart.url);

      // Generate rotating overlay with date/time markings
      const overlayPrompt = `Create a circular planisphere overlay/transparency with:
      - Outer ring with 12 months marked (JAN, FEB, MAR, etc.) evenly spaced
      - Inner ring with 24-hour time markings (00:00 to 23:00) in 1-hour increments
      - A large transparent "window" cut-out showing approximately 60% of the circle
      - The window should be kidney-shaped or oval, showing the visible sky portion
      - Window edges clearly defined with thin lines
      - Semi-transparent gray/blue overlay outside the window
      - Minimal design, clean lines
      - Professional astronomical instrument style
      - White text on dark semi-transparent background
      - Circular format matching the star chart`;

      const overlay = await base44.integrations.Core.GenerateImage({
        prompt: overlayPrompt
      });
      setOverlayUrl(overlay.url);

    } catch (error) {
      console.error("Error generating planisphere:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate which date/time is currently aligned based on rotation
  const getCurrentDateTime = () => {
    const normalizedAngle = ((rotationAngle % 360) + 360) % 360;
    const hour = Math.floor((normalizedAngle / 15) % 24);
    const monthIndex = Math.floor((normalizedAngle / 30) % 12);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      month: months[monthIndex],
      time: `${hour.toString().padStart(2, '0')}:00`
    };
  };

  const getAngleFromCenter = (clientX, clientY, centerX, centerY) => {
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handleStart = (clientX, clientY) => {
    if (!overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = getAngleFromCenter(clientX, clientY, centerX, centerY);
    
    dragStartRef.current = {
      angle: angle - rotationAngle,
      x: clientX,
      y: clientY
    };
    
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !overlayRef.current) return;
    
    const rect = overlayRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentAngle = getAngleFromCenter(clientX, clientY, centerX, centerY);
    const newRotation = currentAngle - dragStartRef.current.angle;
    
    setRotationAngle(newRotation);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, rotationAngle]);

  const dateTime = getCurrentDateTime();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Hawaiian Sky Planisphere
        </h1>
        <p className="text-white/70 text-lg mb-4">
          Interactive star wheel showing Hawaiian constellations
        </p>
        {!loading && starChartUrl && (
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-b from-[#3b82f6] via-[#60a5fa] to-[#3b82f6] text-white text-lg font-semibold shadow-lg">
            {dateTime.month} • {dateTime.time}
          </div>
        )}
      </div>

      {loading ? (
        <Card className="mb-8 bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-[#60a5fa] mx-auto mb-4 animate-spin" />
            <h3 className="text-white font-bold text-xl mb-2">
              Generating Your Hawaiian Planisphere
            </h3>
            <p className="text-white/80 mb-4">
              Creating custom star charts for Hawaiian latitudes...
            </p>
            <p className="text-white/60 text-sm">
              This may take 10-20 seconds
            </p>
          </CardContent>
        </Card>
      ) : !starChartUrl || !overlayUrl ? (
        <Card className="mb-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-amber-200 font-bold text-lg mb-2">Failed to Generate Images</h3>
                <p className="text-white/90 mb-3">
                  There was an issue generating the planisphere images. Please try refreshing the page.
                </p>
                <Button
                  onClick={generatePlanisphereImages}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Planisphere */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Instructions */}
                <div className="mb-4 p-4 rounded-lg bg-[#60A5FA]/10 backdrop-blur-sm border border-[#a855f7]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCw className="w-5 h-5 text-[#60a5fa]" />
                    <p className="text-white font-semibold">How to Use</p>
                  </div>
                  <p className="text-white/80 text-sm">
                    Drag the outer wheel to rotate it. The visible portion shows which stars and 
                    Hawaiian constellations are visible at that date and time from Hawaii.
                  </p>
                </div>

                {/* Planisphere Container */}
                <div className="relative w-full aspect-square max-w-2xl mx-auto">
                  {/* Base Sky Map Layer */}
                  <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#a855f7]/40">
                    <img 
                      src={starChartUrl}
                      alt="Hawaiian Star Chart"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Rotating Overlay Layer */}
                  <div
                    ref={overlayRef}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none"
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <img 
                      src={overlayUrl}
                      alt="Planisphere Overlay"
                      className="w-full h-full object-cover rounded-full"
                      style={{ pointerEvents: 'none' }}
                    />
                    
                    {/* Rotation indicator */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-[#e879f9] w-1 h-6 rounded-full" />
                  </div>
                </div>

                {/* Reset Button */}
                <div className="text-center mt-4">
                  <Button
                    onClick={() => setRotationAngle(0)}
                    variant="outline"
                    className="border-[#60a5fa]/30 text-white hover:bg-[#60a5fa]/20"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Reset Position
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current View Info */}
            <Card className="bg-gradient-to-br from-[#60A5FA]/20 to-[#3b82f6]/20 border-[#a855f7]/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-3">Currently Viewing</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/50 text-xs">Month</p>
                    <p className="text-white text-2xl font-bold">{dateTime.month}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Time</p>
                    <p className="text-white text-2xl font-bold">{dateTime.time}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-white/50 text-xs mb-1">Rotation</p>
                    <p className="text-white">{Math.round(rotationAngle)}°</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 border-[#a855f7]/30">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-3">How It Works</h3>
                <div className="space-y-2 text-white/80 text-sm">
                  <p>
                    This digital planisphere shows the Hawaiian night sky at any date and time.
                  </p>
                  <p>
                    The base map shows all visible stars and Hawaiian constellation patterns from 
                    Hawaii's latitude (20°N).
                  </p>
                  <p>
                    Rotate the outer wheel to align your desired date and time - the visible 
                    portion reveals which stars are above the horizon.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hawaiian Constellations */}
            <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
              <CardContent className="p-4">
                <h3 className="text-emerald-200 font-bold mb-3">Hawaiian Constellations</h3>
                <p className="text-white/90 text-sm mb-3">
                  This planisphere features traditional Hawaiian star patterns used by ancient 
                  navigators to cross the Pacific Ocean.
                </p>
                <p className="text-white/70 text-sm">
                  Look for familiar patterns like Ka Heihei o nā Keiki (Orion) and other 
                  constellations important to Hawaiian wayfinding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}