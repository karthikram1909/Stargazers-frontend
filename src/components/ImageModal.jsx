import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageModal({ open, onOpenChange, imageUrl, title }) {
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