import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Moon, Compass, Globe, Map, Stars, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Layout({ children }) {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { name: "Sky Tonight", path: createPageUrl("Home"), icon: Sparkles },
    { name: "Sky Map", path: createPageUrl("SkyMap"), icon: Map },
    { name: "Star Guide", path: createPageUrl("Stars"), icon: Stars },
    { name: "Planets", path: createPageUrl("Planets"), icon: Globe },
    { name: "Constellations", path: createPageUrl("Constellations"), icon: Stars },
    { name: "Moon Calendar", path: createPageUrl("Moon"), icon: Moon },
    { name: "Wayfinding", path: createPageUrl("Wayfinding"), icon: Compass },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/432ccb59c_couplestargazing.png)',
          backgroundPosition: 'center center',
          zIndex: 0
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" style={{ zIndex: 1 }} />
      
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
          
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-md bg-black/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-2">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/c48fece3e_KILOHAKU2.png" 
                  alt="Stargazers Anonymous" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#60A5FA]"
                />
                <div>
                  <h1 className="text-base font-bold text-white">Stargazers Anonymous Kilo Hōkū</h1>
                  <p className="text-xs text-white/60 hidden sm:block">Hawaiian Astronomy</p>
                </div>
              </div>
              
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Search</span>
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex gap-1 pb-2 overflow-x-auto no-scrollbar">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                        : "bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="bg-[#1E3A5F] border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Search className="w-5 h-5 text-[#60A5FA]" />
                Search Stars, Planets & Constellations
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="Search for Hawaiian names, English names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
              <p className="text-white/60 text-sm mt-4 text-center">
                Search functionality coming soon
              </p>
            </div>
          </DialogContent>
        </Dialog>

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