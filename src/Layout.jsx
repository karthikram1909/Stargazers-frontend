
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Moon, Compass, Globe, Map, Stars, Type, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    setFontSize(savedFontSize);
    document.documentElement.setAttribute('data-font-size', savedFontSize);
  }, []);

  const handleFontSizeChange = () => {
    const sizes = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setFontSize(nextSize);
    localStorage.setItem('fontSize', nextSize);
    document.documentElement.setAttribute('data-font-size', nextSize);
  };

  const getFontSizeLabel = () => {
    switch(fontSize) {
      case 'normal': return 'A';
      case 'large': return 'A+';
      case 'xlarge': return 'A++';
      default: return 'A';
    }
  };

  const navigationItems = [
    { name: "Tonight", path: createPageUrl("Home"), icon: Sparkles },
    { name: "Sky Map", path: createPageUrl("SkyMap"), icon: Map },
    { name: "Stars", path: createPageUrl("Stars"), icon: Stars },
    { name: "Planets", path: createPageUrl("Planets"), icon: Globe },
    { name: "Constellations", path: createPageUrl("Constellations"), icon: Stars },
    { name: "Moon Calendar", path: createPageUrl("Moon"), icon: Moon },
    { name: "Wayfinding", path: createPageUrl("Wayfinding"), icon: Compass },
  ];

  const getBackgroundImage = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("stars") || path.includes("stardetail")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/1cc3d171f_starguide.jpg";
    }
    if (path.includes("planets")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/a36debc57_planet-4534835_1920.jpg";
    }
    if (path.includes("constellations")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/a96cb709d_constellations.jpg";
    }
    if (path.includes("moon")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/3c702c4ef_river-7294102_1920.jpg";
    }
    if (path.includes("wayfinding")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/2bc3b79ca_wayfaring.jpg";
    }
    return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/432ccb59c_couplestargazing.png";
  };

  const backgroundImage = getBackgroundImage();

  return (
    <div className="min-h-screen relative">
      {/* Background with inline style */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
      
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.5), rgba(0,0,0,0.65))',
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <div className="relative min-h-screen" style={{ zIndex: 2 }}>
        <style>{`
          :root {
            --ocean-deep: #0A1929;
            --ocean-mid: #1E3A5F;
            --sky-bright: #60A5FA;
            --sky-light: #3B82F6;
            --cyan: #06B6D4;
            --sand: #F8F9FA;
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          
          .star-twinkle {
            animation: twinkle 3s ease-in-out infinite;
          }

          /* Font Size Controls */
          html[data-font-size="normal"] {
            font-size: 16px;
          }
          html[data-font-size="large"] {
            font-size: 18px;
          }
          html[data-font-size="xlarge"] {
            font-size: 20px;
          }
        `}</style>

        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-md bg-black/30 sticky top-0" style={{ zIndex: 50 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/c48fece3e_KILOHAKU2.png" 
                  alt="Stargazers Anonymous" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#60A5FA]"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">Stargazers Anonymous</h1>
                  <p className="text-sm text-white/80">Kilo Hōkū • Hawaiian Astronomy</p>
                </div>
              </div>
              <Button
                onClick={handleFontSizeChange}
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2 px-3"
                title="Change text size"
              >
                <span className="text-lg font-bold">{getFontSizeLabel()}</span>
                <span className="text-xs hidden sm:inline">Text Size</span>
              </Button>
            </div>
            
            <div className="flex gap-1 pb-3 overflow-x-auto no-scrollbar">
              {/* Search Button - First */}
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
              
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-b from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <main className="relative">
          {children}
        </main>

        <footer className="border-t border-white/10 mt-20 py-8 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/60 text-sm">
              Honoring the celestial knowledge of Hawaiian navigators
            </p>
            <p className="text-white/40 text-xs mt-2">
              ʻIke i ka lā o ka malama - Knowledge of the day and the moon
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
