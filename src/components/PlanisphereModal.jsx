import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanisphereModal({ 
  open, 
  onOpenChange, 
  starChartImage, 
  rotationAngle, 
  viewDirection,
  months 
}) {
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

          {/* Full Planisphere Display */}
          <div 
            className="relative w-[90vmin] h-[90vmin] max-w-[800px] max-h-[800px]"
            onClick={() => onOpenChange(false)}
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
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <mask id="viewingWindowModal">
                    <rect width="400" height="400" fill="white"/>
                    <ellipse cx="200" cy="150" rx="140" ry="120" fill="black"/>
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