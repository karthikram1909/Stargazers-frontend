import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RotateCw } from "lucide-react";

export default function SkyMap() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const overlayRef = useRef(null);
  const dragStartRef = useRef({ angle: 0, x: 0, y: 0 });

  // Calculate which date/time is currently aligned based on rotation
  const getCurrentDateTime = () => {
    // Normalize angle to 0-360
    const normalizedAngle = ((rotationAngle % 360) + 360) % 360;
    
    // Simple calculation - each 15 degrees represents 1 hour
    // 0° = midnight, 90° = 6am, 180° = noon, 270° = 6pm
    const hour = Math.floor((normalizedAngle / 15) % 24);
    
    // For demo purposes - in reality this would map to actual date positions
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
          Interactive Hawaiian Planisphere
        </h1>
        <p className="text-white/70 text-lg mb-4">
          Drag the wheel to see the night sky for different dates and times
        </p>
        <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-b from-[#3b82f6] via-[#60a5fa] to-[#3b82f6] text-white text-lg font-semibold shadow-lg">
          {dateTime.month} • {dateTime.time}
        </div>
      </div>

      {/* Important Notice */}
      <Card className="mb-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-amber-200 font-bold text-lg mb-2">Image Assets Needed</h3>
              <p className="text-white/90 mb-3">
                To complete this planisphere, you need two images created for Hawaiian latitudes (~20°N):
              </p>
              <ol className="list-decimal list-inside space-y-2 text-white/90 ml-4">
                <li>
                  <strong>Base Sky Map:</strong> A circular star chart showing stars and constellations visible from 20° above the horizon to the zenith (90°). This should be a fixed image.
                </li>
                <li>
                  <strong>Rotating Overlay:</strong> A circular disc with months around the outer edge and times marked, with a transparent "window" cut out to reveal the visible portion of the sky map.
                </li>
              </ol>
              <p className="text-white/80 mt-3 text-sm">
                These images can be created using astronomical software (like Stellarium) or by scanning/digitizing a physical planisphere for Hawaiian latitudes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  Click and drag the outer wheel (or use your finger on mobile) to rotate it. 
                  As you rotate, the window reveals different parts of the sky map, showing what's 
                  visible at that date and time - just like a paper planisphere!
                </p>
              </div>

              {/* Planisphere Container */}
              <div className="relative w-full aspect-square max-w-2xl mx-auto">
                {/* Base Sky Map Layer - PLACEHOLDER */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#a855f7]/40">
                  <div className="w-full h-full bg-gradient-to-br from-[#0A1929] via-[#1a1f3a] to-[#0f1729] relative">
                    {/* Placeholder stars pattern */}
                    <div className="absolute inset-0 opacity-60">
                      {[...Array(100)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-white rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Placeholder constellation lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-40">
                      <line x1="30%" y1="30%" x2="40%" y2="25%" stroke="#60a5fa" strokeWidth="2" />
                      <line x1="40%" y1="25%" x2="45%" y2="35%" stroke="#60a5fa" strokeWidth="2" />
                      <line x1="60%" y1="60%" x2="70%" y2="65%" stroke="#a855f7" strokeWidth="2" />
                      <line x1="70%" y1="65%" x2="75%" y2="55%" stroke="#a855f7" strokeWidth="2" />
                    </svg>

                    {/* Center label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[#e879f9] text-sm font-semibold">Luna Lani</p>
                        <p className="text-white/60 text-xs">(Zenith)</p>
                      </div>
                    </div>

                    {/* Instructions overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center bg-black/60 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20 max-w-xs">
                        <Info className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                        <p className="text-white text-sm font-semibold mb-1">
                          Replace with actual sky map
                        </p>
                        <p className="text-white/70 text-xs">
                          Upload your Hawaiian planisphere base image here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rotating Overlay Layer - PLACEHOLDER */}
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
                  {/* Outer ring with months */}
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full" viewBox="0 0 400 400">
                      {/* Outer circle */}
                      <circle
                        cx="200"
                        cy="200"
                        r="195"
                        fill="none"
                        stroke="rgba(96, 165, 250, 0.6)"
                        strokeWidth="3"
                      />
                      
                      {/* Month markers */}
                      {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const x = 200 + Math.cos(angle) * 175;
                        const y = 200 + Math.sin(angle) * 175;
                        const textAngle = i * 30;
                        
                        return (
                          <text
                            key={month}
                            x={x}
                            y={y}
                            fill="white"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textAngle}, ${x}, ${y})`}
                          >
                            {month}
                          </text>
                        );
                      })}

                      {/* "Window" cutout - semi-transparent overlay with clear section */}
                      <defs>
                        <mask id="windowMask">
                          <rect width="400" height="400" fill="white" />
                          {/* Clear window area */}
                          <path
                            d="M 200 200 L 200 50 A 150 150 0 0 1 330 200 Z"
                            fill="black"
                          />
                        </mask>
                      </defs>
                      
                      {/* Semi-transparent overlay with mask */}
                      <circle
                        cx="200"
                        cy="200"
                        r="190"
                        fill="rgba(30, 58, 95, 0.85)"
                        mask="url(#windowMask)"
                      />

                      {/* Window border */}
                      <path
                        d="M 200 200 L 200 50 A 150 150 0 0 1 330 200 Z"
                        fill="none"
                        stroke="rgba(232, 121, 249, 0.8)"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Rotation indicator */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-[#e879f9] w-1 h-6 rounded-full" />
                  </div>
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
                  This digital planisphere mimics the traditional paper star wheel used by navigators.
                </p>
                <p>
                  The outer wheel shows dates and times. Rotate it to align with your desired viewing time, 
                  and the window reveals which stars and constellations are visible in the Hawaiian sky.
                </p>
                <p className="text-[#60a5fa] italic pt-2">
                  Once you provide the actual planisphere images, this will show real star positions!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
            <CardContent className="p-4">
              <h3 className="text-emerald-200 font-bold mb-3">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-white/90 text-sm">
                <li>Create or obtain a planisphere for 20°N latitude</li>
                <li>Separate it into base map and rotating overlay images</li>
                <li>Upload the images to replace the placeholders</li>
                <li>Fine-tune the date/time calculations</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}