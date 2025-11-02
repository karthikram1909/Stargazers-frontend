
import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Navigation, Calendar, Sparkles, Eye, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StarDetail() {
  const navigate = useNavigate();
  const [starId, setStarId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setStarId(id);
  }, []);

  const playPronunciation = () => {
    if (star?.pronunciation_audio_url) {
      const audio = new Audio(star.pronunciation_audio_url);
      audio.play();
    }
  };

  const { data: stars, isLoading } = useQuery({
    queryKey: ['stars'],
    queryFn: () => base44.entities.Star.list(),
    initialData: [],
  });

  const star = stars.find(s => s.id === starId);

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

  if (!star) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <Star className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Star not found</h3>
            <Button
              onClick={() => navigate(createPageUrl("Stars"))}
              variant="outline"
              className="mt-4 border-white/20 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Star Guide
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
        onClick={() => navigate(createPageUrl("Stars"))}
        variant="ghost"
        className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Star Guide
      </Button>

      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center flex-shrink-0 star-twinkle">
              <Star className="w-10 h-10 text-[#0A1929]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-4xl text-white">
                  {star.hawaiian_name}
                </CardTitle>
                {star.pronunciation_audio_url && (
                  <button
                    onClick={playPronunciation}
                    className="text-[#FFD700] hover:text-[#FFA07A] transition-colors p-2 rounded-full hover:bg-white/10"
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                )}
              </div>
              <p className="text-white/60 text-xl mb-3">{star.english_name}</p>
              {star.constellation && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-white/80 text-sm">{star.constellation}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Meaning */}
      {star.meaning && (
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] border-[#FFD700]/30 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              Meaning & Significance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-lg leading-relaxed">
              {star.meaning}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Use */}
      {star.navigation_use && (
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#FF6B6B]" />
              Traditional Navigation Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90 text-lg leading-relaxed">
              {star.navigation_use}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {star.best_viewing_months && (
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FFA07A]" />
                Best Viewing Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-2xl font-semibold">
                {star.best_viewing_months}
              </p>
              <p className="text-white/60 text-sm mt-2">
                Optimal months for observation in Hawaiian skies
              </p>
            </CardContent>
          </Card>
        )}

        {star.brightness !== undefined && star.brightness !== null && (
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FFD700]" />
                Apparent Magnitude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-2xl font-semibold">
                {star.brightness}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {star.brightness < 0
                  ? "Exceptionally bright - one of the brightest stars"
                  : star.brightness < 1
                  ? "Very bright - easily visible"
                  : star.brightness < 2
                  ? "Bright - prominent in the sky"
                  : "Moderate brightness"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Info */}
      <Card className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFA07A]/10 border-[#FFA07A]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#FFD700] mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/90 leading-relaxed mb-3">
                Hawaiian navigators memorized the rising and setting positions of key stars like {star.hawaiian_name}
                to create a mental star compass. This knowledge, passed down through generations, enabled them to
                navigate thousands of miles across the open ocean without instruments.
              </p>
              <p className="text-white/70 text-sm italic">
                "Na ka hoku no ka maka o ka lani" - The stars are the eyes of heaven
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
