
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Compass, Waves, Wind } from "lucide-react";

const techniques = [
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/4dfc1e6dd_starcompass.jpg",
    title: "Star Compass",
    description: "The star compass (Kāpehuʻike hōkū) divides the horizon into 32 houses, each marking where specific stars rise and set. Navigators memorized the paths of stars throughout the night to maintain direction.",
    color: "from-[#60A5FA] to-[#3B82F6]"
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/0cc016fa4_waves.jpg",
    title: "Wave Patterns",
    description: "Master navigators could read ocean swells and wave patterns to detect land, even hundreds of miles away. Different wave patterns indicated proximity to islands and the direction of distant lands.",
    color: "from-[#3B82F6] to-[#60A5FA]"
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/a47ce474a_weather.jpg",
    title: "Wind & Weather",
    description: "Trade winds, cloud formations, and bird behavior provided crucial navigation clues. Certain clouds forming over islands could be seen from great distances, and seabirds flew in predictable patterns.",
    color: "from-[#1E3A5F] to-[#3B82F6]"
  },
];

const keyStars = [
  { name: "Hōkūleʻa", western: "Arcturus", position: "Zenith over Hawaiʻi", use: "Primary navigational star, guides home to Hawaiʻi" },
  { name: "Hōkūpaʻa", western: "Polaris (North Star)", position: "North", use: "Marks true north, stays fixed in the sky" },
  { name: "A'a", western: "Sirius", position: "Southeast", use: "Brightest star, important navigation marker" },
  { name: "Kauluakoko", western: "Betelgeuse", position: "Orion", use: "Marks the warrior constellation, guides to Tahiti" },
];

export default function Wayfinding() {
  return (
    <div className="relative min-h-screen">
      {/* Page-specific background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/6c240e973_wayfaring.jpg)',
          zIndex: -2
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" style={{ zIndex: -1 }} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-0"> {/* Added relative z-0 to ensure content is above background */}
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-[#60A5FA] shadow-xl">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/094ec7b13_wayfairers.jpg"
              alt="Wayfinders"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Wayfinding - Traditional Navigation
          </h1>
          <p className="text-white/70 text-lg">
            The ancient art of navigating by stars, waves, and natural signs
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-12 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              For thousands of years, Polynesian navigators crossed vast ocean expanses using only the stars, 
              waves, winds, and wildlife. Without instruments, they guided double-hulled canoes thousands of 
              miles across open ocean, discovering and settling the islands of the Pacific.
            </p>
            <p className="text-white/70 leading-relaxed">
              This knowledge system, called wayfinding, represents one of humanity's greatest intellectual 
              achievements—a sophisticated science passed down through oral tradition, requiring years of 
              training and a deep connection with the natural world.
            </p>
          </CardContent>
        </Card>

        {/* Techniques */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Navigation Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techniques.map((technique, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-105 transition-all"
              >
                <CardHeader>
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-[#60A5FA] shadow-lg">
                    <img 
                      src={technique.image}
                      alt={technique.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-white text-xl text-center">
                    {technique.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 leading-relaxed">
                    {technique.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Navigation Stars */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Key Navigation Stars
          </h2>
          <div className="space-y-3">
            {keyStars.map((star, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/174409567_starcompass.jpeg"
                        alt="Star Compass"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#60A5FA]"
                      />
                    </div>
                    <div className="flex-1 grid md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-white font-bold mb-1">{star.name}</h3>
                        <p className="text-white/60 text-sm">{star.western}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Position
                        </p>
                        <p className="text-white/80 text-sm">{star.position}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Navigation Use
                        </p>
                        <p className="text-white/80 text-sm">{star.use}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hōkūleʻa Legacy */}
        <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#0A1929] border-[#60A5FA]/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              The Legacy of Hōkūleʻa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/90 leading-relaxed">
              In 1976, the voyaging canoe Hōkūleʻa made her maiden voyage from Hawaiʻi to Tahiti 
              using only traditional wayfinding techniques—no modern instruments. This historic journey, 
              led by master navigator Mau Piailug from Satawal, sparked a Hawaiian cultural renaissance.
            </p>
            <p className="text-white/80 leading-relaxed">
              Hōkūleʻa proved that ancient Polynesians intentionally explored and settled the Pacific, 
              not by accident, but through sophisticated navigation knowledge. Since then, Hōkūleʻa has 
              sailed over 150,000 miles, training a new generation of wayfinders and inspiring indigenous 
              cultural revival across the Pacific.
            </p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-[#60A5FA] italic">
                "We learn from the past, voyage in the present, and look to guide the future."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
