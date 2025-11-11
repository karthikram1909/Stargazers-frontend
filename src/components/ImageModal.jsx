import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageModal({ open, onOpenChange, imageUrl, title }) {
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
          {title && (
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
            </div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title || "Full size image"}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}