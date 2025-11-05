import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageModal({ open, onOpenChange, imageUrl, title, starInfo }) {
  const [showStarLabels, setShowStarLabels] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-white/20">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 p-0"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {title && (
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
              <h3 className="text-white font-semibold">{title}</h3>
            </div>
          )}

          {starInfo && (
            <>
              <Button
                onClick={() => setShowStarLabels(!showStarLabels)}
                className="absolute top-20 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                {showStarLabels ? 'Hide Stars' : 'Show Stars'}
              </Button>

              {showStarLabels && (
                <div className="absolute top-20 left-4 z-50 bg-black/80 backdrop-blur-sm px-4 py-4 rounded-lg max-w-xs max-h-[70vh] overflow-y-auto">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Stars in this Constellation
                  </h4>
                  <div className="space-y-3">
                    {starInfo.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const parts = line.split('|').map(p => p.trim());
                      if (parts.length >= 2) {
                        return (
                          <div key={idx} className="border-b border-white/10 pb-2 last:border-0">
                            <p className="text-[#60A5FA] font-medium text-sm">{parts[0]}</p>
                            <p className="text-white/70 text-xs">{parts[1]}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </>
          )}
          
          <img
            src={imageUrl}
            alt={title || "Full size image"}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}