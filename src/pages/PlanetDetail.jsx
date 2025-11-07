
import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Volume2, Sparkles, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ImageModal from "../components/ImageModal";

export default function PlanetDetail() {
  const navigate = useNavigate();
  const [planetId, setPlanetId] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setPlanetId(id);
  }, []);

  const playPronunciation = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleImageClick = (imageUrl, planetName) => {
    setSelectedImage({ url: imageUrl, title: planetName });
    setImageModalOpen(true);
  };

  const { data: planet, isLoading, error } = useQuery({
    queryKey: ['planet', planetId],
    queryFn: async () => {
      if (!planetId) return null;
      const planets = await base44.entities.Planet.list();
      const foundPlanet = planets.find(p => p.id === planetId);
      return foundPlanet || null;
    },
    enabled: !!planetId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-white/10 rounded-3xl" />
          <div className="h-96 bg-white/10 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!planetId || !planet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <Globe className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Planet not found</h3>
            <p className="text-white/60 mb-4">
              {!planetId ? 'No planet ID provided in the URL' : `Unable to find planet with ID: ${planetId}`}
            </p>
            <Button
              onClick={() => navigate(createPageUrl("Planets"))}
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Planets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        onClick={() => navigate(createPageUrl("Planets"))}
        variant="ghost"
        className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Planets
      </Button>

      {/* Hero Card with Image */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {planet.image_url ? (
              <div 
                className="flex-shrink-0 relative cursor-pointer group mx-auto md:mx-0"
                onClick={() => handleImageClick(planet.image_url, planet.hawaiian_name)}
              >
                <img 
                  src={planet.image_url} 
                  alt={planet.hawaiian_name}
                  className="w-40 h-40 object-cover rounded-full border-4 border-white/20 shadow-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/30">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <div className="text-center">
                    <ZoomIn className="w-8 h-8 text-white mx-auto mb-1" />
                    <p className="text-white text-xs font-medium">Tap to enlarge</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0 mx-auto md:mx-0">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/d458030cb_IMG_2152.jpeg"
                  alt="Planet"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <CardTitle className="text-4xl text-white">
                  {planet.hawaiian_name}
                </CardTitle>
                {planet.pronunciation_audio_url && (
                  <button
                    onClick={() => playPronunciation(planet.pronunciation_audio_url)}
                    className="text-[#0EA5E9] hover:text-[#60A5FA] transition-colors p-2 rounded-full hover:bg-white/10 mx-auto md:mx-0"
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                )}
              </div>
              <p className="text-white/60 text-xl mb-3">{planet.english_name}</p>
              {planet.meaning && (
                <p className="text-[#60A5FA] text-lg italic">
                  {planet.meaning}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      {planet.description && (
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] border-[#60A5FA]/30 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#0EA5E9]" />
              About {planet.english_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-lg leading-relaxed">
              {planet.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mythology & Cultural References */}
      {planet.mythology && (
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#60A5FA]" />
              Mythology & Cultural References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-lg leading-relaxed">
              {planet.mythology}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/10 border-[#60A5FA]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#0EA5E9] mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/90 leading-relaxed mb-3">
                Ancient Hawaiians called planets "hōkūhele" or "wandering stars" because they moved 
                against the fixed backdrop of stars. These celestial wanderers were closely observed 
                and incorporated into navigation, timekeeping, and cultural practices.
              </p>
              <p className="text-white/70 text-sm italic">
                "He hōkū hele nō ka lani" - The wandering stars of the heavens
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <ImageModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        imageUrl={selectedImage.url}
        title={selectedImage.title}
      />
    </div>
  );
}
