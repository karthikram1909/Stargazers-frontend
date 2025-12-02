import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, ZoomIn } from "lucide-react";
import ImageModal from "../components/ImageModal";
import { createPageUrl } from "@/utils";

export default function ConstellationDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  const navigate = useNavigate();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [playingAudio, setPlayingAudio] = useState(false);
  const audioRef = React.useRef(new Audio());

  const { data: constellation, isLoading } = useQuery({
    queryKey: ['constellation', id],
    queryFn: async () => {
      const results = await base44.entities.Constellation.list();
      return results.find(c => c.id === id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [constellation]);

  const playPronunciation = (audioUrl) => {
    if (audioUrl && !playingAudio) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setPlayingAudio(true);
      audioRef.current.onended = () => setPlayingAudio(false);
      audioRef.current.onerror = () => setPlayingAudio(false);
    }
  };

  const handleImageClick = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title: title });
    setImageModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-white/10 rounded-lg" />
          <div className="h-48 bg-white/10 rounded-lg" />
          <div className="h-32 bg-white/10 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!constellation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Constellation Not Found</h2>
        <p className="text-white/70 mb-6">We couldn't find the constellation you're looking for.</p>
        <Button onClick={() => navigate(createPageUrl("Constellations"))} className="bg-blue-500 hover:bg-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Constellations
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Button
        onClick={() => navigate(createPageUrl("Constellations"))}
        className="mb-6 bg-white/10 hover:bg-white/20 text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Constellations
      </Button>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-3xl mb-1 flex items-center gap-2">
                {constellation.hawaiian_name}
                {constellation.pronunciation_audio_url && (
                  <button
                    onClick={() => playPronunciation(constellation.pronunciation_audio_url)}
                    disabled={playingAudio}
                    className={`transition-all ${
                      playingAudio
                        ? 'text-white scale-90'
                        : 'text-[#0EA5E9] hover:text-[#60A5FA] active:text-white active:scale-90'
                    }`}
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>
                )}
              </CardTitle>
              <p className="text-white/60 text-xl">{constellation.english_name}</p>
            </div>
            {constellation.image_url && (
              <div 
                className="relative cursor-pointer group flex-shrink-0"
                onClick={() => handleImageClick(constellation.image_url, constellation.hawaiian_name)}
              >
                <img
                  src={constellation.image_url}
                  alt={constellation.hawaiian_name}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-white/20"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm rounded-full p-1 border border-white/30">
                  <ZoomIn className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {constellation.meaning && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Meaning</p>
              <p className="text-white text-lg italic">{constellation.meaning}</p>
            </div>
          )}

          {constellation.stars_description && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Stars Described</p>
              <p className="text-white/80 text-base leading-relaxed">{constellation.stars_description}</p>
            </div>
          )}

          {constellation.navigation_use && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Navigation Use</p>
              <p className="text-white/80 text-base leading-relaxed">{constellation.navigation_use}</p>
            </div>
          )}

          {constellation.best_viewing_months && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Best Viewing Months</p>
              <p className="text-white/80 text-base leading-relaxed">{constellation.best_viewing_months}</p>
            </div>
          )}

          {constellation.mythology && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Mythology</p>
              <p className="text-white/80 text-base leading-relaxed">{constellation.mythology}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ImageModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        imageUrl={selectedImage.url}
        title={selectedImage.title}
      />
    </div>
  );
}