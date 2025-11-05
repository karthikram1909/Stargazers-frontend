import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Moon, Compass, Globe, Map, Stars } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Sky Tonight", path: createPageUrl("Home"), icon: Sparkles },
    { name: "Sky Map", path: createPageUrl("SkyMap"), icon: Map },
    { name: "Star Guide", path: createPageUrl("Stars"), icon: Stars },
    { name: "Planets", path: createPageUrl("Planets"), icon: Globe },
    { name: "Constellations", path: createPageUrl("Constellations"), icon: Stars },
    { name: "Moon Calendar", path: createPageUrl("Moon"), icon: Moon },
    { name: "Wayfinding", path: createPageUrl("Wayfinding"), icon: Compass },
  ];

  // Determine background based on current page
  const getBackgroundImage = () => {
    const path = location.pathname;
    if (path.includes("Stars") || path.includes("StarDetail")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/56fa859bb_starguide.jpg";
    }
    if (path.includes("Planets")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/f801deb47_planet-4534835_1920.jpg";
    }
    if (path.includes("Constellations")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/dff8e2292_constellations.jpg";
    }
    if (path.includes("Moon")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/5a60288ea_river-7294102_1920.jpg";
    }
    if (path.includes("Wayfinding")) {
      return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/72fa687e4_wayfaring.jpg";
    }
    // Default background for Home and SkyMap
    return "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/432ccb59c_couplestargazing.png";
  };

  const backgroundImage = getBackgroundImage();

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          zIndex: 0,
        }}
      />
      
      {/* Lighter overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
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
        `}</style>

        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-md bg-black/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/c48fece3e_KILOHAKU2.png" 
                  alt="Stargazers Anonymous" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#60A5FA]"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">Stargazers Anonymous Kilo Hōkū</h1>
                  <p className="text-xs text-white/60">Hawaiian Astronomy</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex gap-1 pb-3 overflow-x-auto no-scrollbar">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative">
          {children}
        </main>

        {/* Footer */}
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