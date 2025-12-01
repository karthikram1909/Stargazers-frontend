import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanisphereModal({ 
  open, 
  onOpenChange, 
  starChartImage, 
  rotationAngle: initialRotation, 
  viewDirection,
  months 
}) {
  const [rotationAngle, setRotationAngle] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const planisphereRef = useRef(null);

  // Sync with parent rotation when modal opens
  useEffect(() => {
    if (open) {
      setRotationAngle(initialRotation);
    }
  }, [open, initialRotation]);

  const handleMouseDown = (e) => {
    if (!planisphereRef.current) return;
    e.stopPropagation();
    setIsDragging(true);
    const rect = planisphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !planisphereRef.current) return;
    const rect = planisphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1 || !planisphereRef.current) return;
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = planisphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    setDragStartAngle(angle - rotationAngle);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1 || !planisphereRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = planisphereRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    setRotationAngle(angle - dragStartAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
  }, [isDragging, dragStartAngle, rotationAngle]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black border-0 m-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full w-12 h-12 p-0 border border-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
            <h3 className="text-white font-semibold text-lg">
              {viewDirection === "north" ? "Ko'olau (North) Sky" : "Kona (South) Sky"}
            </h3>
          </div>

          {/* Reset Button */}
          <Button
            onClick={() => setRotationAngle(0)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          {/* Full Planisphere Display - Much Larger */}
          <div 
            ref={planisphereRef}
            className="relative w-[95vmin] h-[95vmin] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Base Star Chart */}
            <div className="absolute inset-[3%] rounded-full overflow-hidden border-4 border-[#a855f7]/40 shadow-2xl">
              <img 
                src={starChartImage}
                alt="Hawaiian Star Chart"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rotating Overlay with Text */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full overflow-hidden"
              style={{ 
                transform: `rotate(${rotationAngle}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <mask id="viewingWindowModal">
                    <rect width="400" height="400" fill="white"/>
                    <ellipse cx="200" cy="140" rx="140" ry="70" fill="black"/>
                  </mask>
                  <clipPath id="circleClipModal">
                    <circle cx="200" cy="200" r="200"/>
                  </clipPath>
                  <linearGradient id="blueGradientModal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="40%" stopColor="#BAE6FD" />
                    <stop offset="100%" stopColor="#7DD3FC" />
                  </linearGradient>
                  <path 
                    id="curveTopModal" 
                    d="M 50 300 Q 200 355 350 300" 
                    fill="none"
                  />
                  <path 
                    id="curveBottomModal" 
                    d="M 60 335 Q 200 370 340 335" 
                    fill="none"
                  />
                </defs>
                
                <g clipPath="url(#circleClipModal)">
                  {/* Semi-transparent overlay with window cutout */}
                  <rect width="400" height="400" fill="rgba(0,0,0,0.7)" mask="url(#viewingWindowModal)"/>
                  
                  {/* Text */}
                  <text fill="url(#blueGradientModal)" fontSize="18" fontWeight="bold" letterSpacing="2" stroke="#BAE6FD" strokeWidth="0.5">
                    <textPath href="#curveTopModal" startOffset="50%" textAnchor="middle">
                      STARGAZERS ANONYMOUS
                    </textPath>
                  </text>
                  <text fill="url(#blueGradientModal)" fontSize="28" fontWeight="bold" letterSpacing="4" stroke="#BAE6FD" strokeWidth="0.5">
                    <textPath href="#curveBottomModal" startOffset="50%" textAnchor="middle">
                      MAUI
                    </textPath>
                  </text>
                  
                  {/* Outer date ring */}
                  <circle cx="200" cy="200" r="195" fill="none" stroke="white" strokeWidth="2"/>
                  {months.map((month, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
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
                        transform={`rotate(${i * 30}, ${x}, ${y})`}
                      >
                        {month}
                      </text>
                    );
                  })}
                  
                  {/* Inner time ring */}
                  <circle cx="200" cy="200" r="175" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
                  {Array.from({length: 24}, (_, i) => {
                    const angle = (i * 15 - 90) * (Math.PI / 180);
                    const x = 200 + 170 * Math.cos(angle);
                    const y = 200 + 170 * Math.sin(angle);
                    return i % 2 === 0 ? (
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
                </g>
              </svg>
            </div>

            {/* Static Red Indicator */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <g>
                  <rect x="197" y="5" width="6" height="25" fill="#ef4444" rx="3"/>
                  <polygon points="200,30 195,35 205,35" fill="#ef4444"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}