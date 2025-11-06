
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, RotateCw } from "lucide-react";

export default function SkyMap() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const planisphereRef = useRef(null);

  const handleMouseDown = (e) => {
    // Ensure the ref is attached to the DOM element
    if (!planisphereRef.current) return;

    setIsDragging(true);
    const rect = planisphereRef.current.getBoundingClientRect(); // Use ref instead of e.currentTarget
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleMouseMove = (e) => {
    // Ensure the ref is attached to the DOM element
    if (!isDragging || !planisphereRef.current) return;

    const rect = planisphereRef.current.getBoundingClientRect(); // Use ref instead of e.currentTarget
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    // Ensure the ref is attached to the DOM element and only one touch
    if (e.touches.length !== 1 || !planisphereRef.current) return;

    const touch = e.touches[0];
    setIsDragging(true);
    const rect = planisphereRef.current.getBoundingClientRect(); // Use ref instead of e.currentTarget
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleTouchMove = (e) => {
    // Ensure the ref is attached to the DOM element, dragging, and only one touch
    if (!isDragging || e.touches.length !== 1 || !planisphereRef.current) return;

    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const rect = planisphereRef.current.getBoundingClientRect(); // Use ref instead of e.currentTarget
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      // Add event listeners to the document for global tracking
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // Cleanup function to remove event listeners
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStartAngle, rotationAngle]); // Dependencies for useEffect

  // Calculate current date and time based on rotation
  const normalizedAngle = ((rotationAngle % 360) + 360) % 360; // Normalize angle to 0-359.99
  const monthIndex = Math.floor((normalizedAngle / 30) % 12); // Each month approx 30 degrees
  const hour = Math.floor((normalizedAngle / 15) % 24); // Each hour approx 15 degrees
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-b from-[#3b82f6] via-[#60a5fa] to-[#3b82f6] text-white text-lg font-semibold shadow-lg">
          {months[monthIndex]} • {hour.toString().padStart(2, '0')}:00
        </div>
      </div>

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
              <div 
                ref={planisphereRef} // Attach the ref here
                className="relative w-full aspect-square max-w-2xl mx-auto cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* Base Star Chart */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0A1929] via-[#1a2744] to-[#0A1929] border-4 border-[#a855f7]/40 overflow-hidden">
                  {/* Star field background */}
                  <div className="absolute inset-0">
                    {/* Celestial Equator */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                      <circle cx="200" cy="200" r="160" fill="none" stroke="#60A5FA" strokeWidth="1" opacity="0.3" strokeDasharray="4 4"/>
                      
                      {/* Cardinal directions */}
                      <text x="200" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">N</text>
                      <text x="370" y="205" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">E</text>
                      <text x="200" y="380" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">S</text>
                      <text x="30" y="205" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">W</text>
                      
                      {/* Altitude circles */}
                      <circle cx="200" cy="200" r="40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                      <circle cx="200" cy="200" r="80" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                      <circle cx="200" cy="200" r="120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                      <circle cx="200" cy="200" r="160" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                      
                      {/* Sample stars */}
                      <circle cx="200" cy="100" r="3" fill="white" opacity="0.9"/>
                      <circle cx="150" cy="120" r="2" fill="white" opacity="0.7"/>
                      <circle cx="250" cy="140" r="2.5" fill="white" opacity="0.8"/>
                      <circle cx="180" cy="160" r="2" fill="white" opacity="0.6"/>
                      <circle cx="220" cy="180" r="3" fill="white" opacity="0.9"/>
                      <circle cx="160" cy="200" r="2" fill="white" opacity="0.7"/>
                      <circle cx="240" cy="220" r="2.5" fill="white" opacity="0.8"/>
                      <circle cx="200" cy="240" r="2" fill="white" opacity="0.6"/>
                      <circle cx="140" cy="160" r="1.5" fill="white" opacity="0.5"/>
                      <circle cx="260" cy="180" r="1.5" fill="white" opacity="0.5"/>
                      
                      {/* Hawaiian constellation example (simplified Makaliʻi/Pleiades) */}
                      <g opacity="0.9">
                        <circle cx="280" cy="120" r="2" fill="#60A5FA"/>
                        <circle cx="285" cy="125" r="2" fill="#60A5FA"/>
                        <circle cx="275" cy="125" r="2" fill="#60A5FA"/>
                        <circle cx="280" cy="130" r="2" fill="#60A5FA"/>
                        <circle cx="290" cy="120" r="1.5" fill="#60A5FA"/>
                        <circle cx="270" cy="115" r="1.5" fill="#60A5FA"/>
                        <text x="280" y="145" textAnchor="middle" fill="#60A5FA" fontSize="10">Makaliʻi</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Rotating Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <mask id="viewingWindow">
                        <rect width="400" height="400" fill="white"/>
                        <ellipse cx="200" cy="150" rx="140" ry="120" fill="black"/>
                      </mask>
                    </defs>
                    
                    {/* Semi-transparent overlay with window cutout */}
                    <rect width="400" height="400" fill="rgba(0,0,0,0.7)" mask="url(#viewingWindow)"/>
                    
                    {/* Outer date ring */}
                    <circle cx="200" cy="200" r="195" fill="none" stroke="white" strokeWidth="2"/>
                    {months.map((month, i) => {
                      // Calculate position for month labels
                      const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start at 12 o'clock (Jan)
                      const x = 200 + 185 * Math.cos(angle);
                      const y = 200 + 185 * Math.sin(angle);
                      return (
                        <text 
                          key={month} 
                          x={x} 
                          y={y} 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          fill="white" 
                          fontSize="12"
                          fontWeight="bold"
                          transform={`rotate(${i * 30}, ${x}, ${y})`} // Rotate text for better readability
                        >
                          {month}
                        </text>
                      );
                    })}
                    
                    {/* Inner time ring */}
                    <circle cx="200" cy="200" r="175" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
                    {Array.from({length: 24}, (_, i) => {
                      // Calculate position for hour labels
                      const angle = (i * 15 - 90) * (Math.PI / 180); // -90 to start at 12 o'clock (0 hour)
                      const x = 200 + 170 * Math.cos(angle);
                      const y = 200 + 170 * Math.sin(angle);
                      return i % 2 === 0 ? ( // Only show even hours for less clutter
                        <text 
                          key={i} 
                          x={x} 
                          y={y} 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          fill="white" 
                          fontSize="10"
                          opacity="0.8"
                        >
                          {i}
                        </text>
                      ) : null;
                    })}
                    
                    {/* Rotation indicator at top */}
                    <rect x="197" y="5" width="6" height="20" fill="#e879f9" rx="3"/>
                  </svg>
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
                  <p className="text-white text-2xl font-bold">{months[monthIndex]}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Time</p>
                  <p className="text-white text-2xl font-bold">{hour.toString().padStart(2, '0')}:00</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/50 text-xs mb-1">Rotation</p>
                  <p className="text-white">{Math.round(normalizedAngle)}°</p>
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
                Look for familiar patterns like Makaliʻi (Pleiades), Ka Heihei o nā Keiki (Orion) 
                and other constellations important to Hawaiian wayfinding.
              </p>
            </CardContent>
          </Card>

          {/* Note about mockup */}
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-amber-200 font-bold mb-2">Interactive Mockup</h3>
                  <p className="text-white/90 text-sm">
                    This is an interactive visualization. For detailed constellation information, 
                    visit the Constellations page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
