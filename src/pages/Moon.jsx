import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Moon as MoonIcon, Search, Volume2 } from "lucide-react";
import MoonPhaseIcon from "../components/MoonPhaseIcon";

const lunarMonths = [
  { name: "Makaliʻi", meaning: "Eyes of the Chief", description: "November-December. A time of cool weather and calm seas." },
  { name: "Kaʻelo", meaning: "The Moisture", description: "December-January. Season of rain and growth." },
  { name: "Kaulua", meaning: "Two Placed Together", description: "January-February. A time of twin blessings." },
  { name: "Nana", meaning: "Spring", description: "February-March. Plants begin to blossom." },
  { name: "Welo", meaning: "Dark Red", description: "March-April. Red earth exposed by spring rains." },
  { name: "Ikiiki", meaning: "Little", description: "April-May. A short month of transition." },
  { name: "Kaʻaona", meaning: "The Whistling", description: "May-June. Whistling trade winds." },
  { name: "Hilinehu", meaning: "Held Down by Fog", description: "June-July. Misty summer mornings." },
  { name: "Hilinaehu", meaning: "Held Down by Moisture", description: "July-August. Humid season begins." },
  { name: "Hilinama", meaning: "Held Down by Dew", description: "August-September. Heavy dew falls." },
  { name: "Ikuā", meaning: "Strong", description: "September-October. Strong winds and high seas." },
  { name: "Welehu", meaning: "Dark Red Skin", description: "October-November. Reddish hue in the sky." },
];

const moonPhases = [
  { day: 1, name: "Hilo", meaning: "To twist or braid", description: "First visible crescent. Good for planting root crops.", phase: "new", pronunciation_audio_url: "" },
  { day: 2, name: "Hoaka", meaning: "Crescent", description: "Crescent moon. Good night for fishing.", phase: "waxing-crescent", pronunciation_audio_url: "" },
  { day: 3, name: "Kūkahi", meaning: "First standing", description: "Moon stands upright. Plant leafy vegetables.", phase: "waxing-crescent", pronunciation_audio_url: "" },
  { day: 4, name: "Kūlua", meaning: "Second standing", description: "Good for most activities.", phase: "waxing-crescent", pronunciation_audio_url: "" },
  { day: 5, name: "Kūkolu", meaning: "Third standing", description: "Excellent for planting and fishing.", phase: "waxing-crescent", pronunciation_audio_url: "" },
  { day: 6, name: "Kūpau", meaning: "Completely standing", description: "Complete the standing phase. Very productive night.", phase: "waxing-crescent", pronunciation_audio_url: "" },
  { day: 7, name: "ʻOlekūkahi", meaning: "First nothing", description: "First of the unproductive nights. Rest.", phase: "first-quarter", pronunciation_audio_url: "" },
  { day: 8, name: "ʻOlekūlua", meaning: "Second nothing", description: "Unproductive night. Avoid planting.", phase: "first-quarter", pronunciation_audio_url: "" },
  { day: 9, name: "ʻOlekūkolu", meaning: "Third nothing", description: "Unproductive night. Time for reflection.", phase: "first-quarter", pronunciation_audio_url: "" },
  { day: 10, name: "ʻOlepau", meaning: "Completely nothing", description: "Last unproductive night of this phase.", phase: "first-quarter", pronunciation_audio_url: "" },
  { day: 11, name: "Huna", meaning: "Hidden", description: "Small and hidden. Good for secretive work.", phase: "waxing-gibbous", pronunciation_audio_url: "" },
  { day: 12, name: "Mōhalu", meaning: "To unfold", description: "Moon unfolds its light. Plant flowers.", phase: "waxing-gibbous", pronunciation_audio_url: "" },
  { day: 13, name: "Hua", meaning: "Egg or fruit", description: "Round like an egg. Excellent for planting fruit.", phase: "waxing-gibbous", pronunciation_audio_url: "" },
  { day: 14, name: "Akua", meaning: "God or spirit", description: "Sacred night. Honor the ancestors.", phase: "full", pronunciation_audio_url: "" },
  { day: 15, name: "Hoku", meaning: "Full moon", description: "Brightest night. Celebration and gathering.", phase: "full", pronunciation_audio_url: "" },
  { day: 16, name: "Māhealani", meaning: "Heavenly haze", description: "Moon begins to wane. Complete projects.", phase: "full", pronunciation_audio_url: "" },
  { day: 17, name: "Kulu", meaning: "To drip", description: "Light drips away. Harvest time.", phase: "waning-gibbous", pronunciation_audio_url: "" },
  { day: 18, name: "Lāʻaukūkahi", meaning: "First plant", description: "Good for harvesting root vegetables.", phase: "waning-gibbous", pronunciation_audio_url: "" },
  { day: 19, name: "Lāʻaukūlua", meaning: "Second plant", description: "Continue harvesting.", phase: "waning-gibbous", pronunciation_audio_url: "" },
  { day: 20, name: "Lāʻaupau", meaning: "Completed plant", description: "Complete the harvest phase.", phase: "waning-gibbous", pronunciation_audio_url: "" },
  { day: 21, name: "ʻOlekūkahi", meaning: "First nothing", description: "Unproductive night. Rest and reflect.", phase: "last-quarter", pronunciation_audio_url: "" },
  { day: 22, name: "ʻOlekūlua", meaning: "Second nothing", description: "Avoid starting new projects.", phase: "last-quarter", pronunciation_audio_url: "" },
  { day: 23, name: "ʻOlepau", meaning: "Completely nothing", description: "Last unproductive night. Prepare for Kāloa.", phase: "last-quarter", pronunciation_audio_url: "" },
  { day: 24, name: "Kāloakūkahi", meaning: "First long", description: "First of the long nights. Deep fishing.", phase: "waning-crescent", pronunciation_audio_url: "" },
  { day: 25, name: "Kāloakūlua", meaning: "Second long", description: "Good for deep-sea fishing.", phase: "waning-crescent", pronunciation_audio_url: "" },
  { day: 26, name: "Kāloapau", meaning: "Completed long", description: "Last of the long nights.", phase: "waning-crescent", pronunciation_audio_url: "" },
  { day: 27, name: "Kāne", meaning: "Man (deity)", description: "Sacred to the god Kāne. Spiritual practices.", phase: "waning-crescent", pronunciation_audio_url: "" },
  { day: 28, name: "Lono", meaning: "Sound (deity)", description: "Sacred to the god Lono. Prayer and offerings.", phase: "waning-crescent", pronunciation_audio_url: "" },
  { day: 29, name: "Mauli", meaning: "Life force", description: "The spirit of life. Introspection.", phase: "new", pronunciation_audio_url: "" },
  { day: 30, name: "Muku", meaning: "Cut off", description: "Dark moon. Complete rest. End of cycle.", phase: "new", pronunciation_audio_url: "" },
];

export default function Moon() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioCache = useRef({});

  useEffect(() => {
    moonPhases.forEach((phase, index) => {
      if (phase.pronunciation_audio_url && !audioCache.current[index]) {
        const audio = new Audio(phase.pronunciation_audio_url);
        audio.preload = 'auto';
        audioCache.current[index] = audio;
      }
    });
  }, []);

  const playPronunciation = (audioUrl, phaseIndex) => {
    if (audioUrl && playingAudio !== phaseIndex) {
      const audio = audioCache.current[phaseIndex];
      if (audio) {
        setPlayingAudio(phaseIndex);
        audio.currentTime = 0;
        audio.onended = () => setPlayingAudio(null);
        audio.onerror = () => setPlayingAudio(null);
        audio.play();
      }
    }
  };

  const filteredMonths = lunarMonths.filter(month => {
    const query = searchQuery.toLowerCase();
    return (
      month.name.toLowerCase().includes(query) ||
      month.meaning.toLowerCase().includes(query) ||
      month.description.toLowerCase().includes(query)
    );
  });

  const filteredPhases = moonPhases.filter(phase => {
    const query = searchQuery.toLowerCase();
    return (
      phase.name.toLowerCase().includes(query) ||
      phase.meaning.toLowerCase().includes(query) ||
      phase.description.toLowerCase().includes(query) ||
      String(phase.day).includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-4">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/a7c8bc5c4_moonphaseimage.jpeg"
            alt="Moon Phases"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Mahina - Hawaiian Lunar Calendar
        </h1>
        <p className="text-white/70 text-lg">
          Ancient timekeeping by the moon
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search lunar months and phases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm h-12 text-lg"
          />
        </div>
      </div>

      {/* Moon Phases - MOVED TO TOP */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Nā Pō o ka Mahina - Moon Phases
        </h2>
        {filteredPhases.length === 0 ? (
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">No moon phases found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPhases.map((phase, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-28 h-28 flex items-center justify-center">
                        <MoonPhaseIcon phase={phase.phase} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">
                          {phase.name}
                        </h3>
                        {phase.pronunciation_audio_url && (
                          <button
                            onClick={() => playPronunciation(phase.pronunciation_audio_url, index)}
                            disabled={playingAudio === index}
                            className={`transition-all ${
                              playingAudio === index
                                ? 'text-white scale-90'
                                : 'text-[#0EA5E9] hover:text-[#60A5FA] active:text-white active:scale-90'
                            }`}
                            title="Play pronunciation"
                          >
                            <Volume2 className="w-8 h-8" />
                          </button>
                        )}
                        <span className="text-white/50 text-sm ml-2">Day {phase.day}</span>
                      </div>
                      <p className="text-[#60A5FA] text-sm mb-2">
                        {phase.meaning}
                      </p>
                      <p className="text-white/70 text-sm">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lunar Months */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Nā Malama - The Months
        </h2>
        {filteredMonths.length === 0 ? (
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/60">No lunar months found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMonths.map((month, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-105 transition-all"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">
                    {month.name}
                  </CardTitle>
                  <p className="text-[#60A5FA] text-sm">{month.meaning}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{month.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cultural Note */}
      <Card className="mt-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 border-[#60A5FA]/30">
        <CardContent className="p-6">
          <p className="text-white/90 italic leading-relaxed">
            "The Hawaiian people used the phases of the moon to guide fishing, farming, and cultural practices. 
            Each night of the lunar month had its own name and significance, creating a detailed calendar 
            that connected daily life with the rhythms of nature."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}