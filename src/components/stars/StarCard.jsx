import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2, Navigation, ArrowRight, Volume2 } from "lucide-react";

export default function StarCard({ star, onEdit, onDelete }) {
  const playPronunciation = (e) => {
    e.stopPropagation();
    if (star.pronunciation_audio_url) {
      const audio = new Audio(star.pronunciation_audio_url);
      audio.play();
    }
  };

  const handleCardClick = () => {
    const newPath = window.location.pathname.replace(/\/[^/]+$/, '/stardetail');
    const newUrl = `${window.location.origin}${newPath}?id=${star.id}`;
    window.location.href = newUrl;
  };

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-105 transition-all group">
      <div onClick={handleCardClick} className="cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white text-lg group-hover:text-[#60A5FA] transition-colors">
                    {star.hawaiian_name}
                  </CardTitle>
                  {star.pronunciation_audio_url && (
                    <button
                      onClick={playPronunciation}
                      className="text-[#0EA5E9] hover:text-[#60A5FA] transition-colors"
                      title="Play pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-white/60 text-base">{star.english_name}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#60A5FA] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {star.meaning && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                Meaning
              </p>
              <p className="text-white/90 text-base leading-relaxed line-clamp-2">
                {star.meaning}
              </p>
            </div>
          )}

          {star.navigation_use && (
            <div className="flex gap-2 items-start p-3 rounded-lg bg-white/5 border border-white/10">
              <Navigation className="w-4 h-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                  Navigation Use
                </p>
                <p className="text-white/80 text-base line-clamp-2">
                  {star.navigation_use}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex gap-4 flex-1 flex-wrap">
              {star.constellation && (
                <div>
                  <span className="text-white/50 text-xs">Constellation</span>
                  <p className="text-white/80 text-base font-medium">
                    {star.constellation}
                  </p>
                </div>
              )}

              {star.brightness !== undefined && star.brightness !== null && (
                <div>
                  <span className="text-white/50 text-xs">Magnitude</span>
                  <p className="text-white/80 text-base font-medium">
                    {star.brightness.toFixed(2)}
                  </p>
                </div>
              )}

              {star.best_viewing_months && (
                <div>
                  <span className="text-white/50 text-xs">Best Viewing</span>
                  <p className="text-white/80 text-base">
                    {star.best_viewing_months}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      
      <CardContent className="pt-0">
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-white/70 hover:text-red-400 hover:bg-white/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}