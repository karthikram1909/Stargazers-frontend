import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Moon, Compass, BookOpen } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const navigationItems = [
    { name: "Sky Tonight", path: createPageUrl("Home"), icon: Sparkles },
    { name: "Star Guide", path: createPageUrl("Stars"), icon: Sparkles },
    { name: "Moon Calendar", path: createPageUrl("Moon"), icon: Moon },
    { name: "Wayfinding", path: createPageUrl("Wayfinding"), icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1929] via-[#1E3A5F] to-[#0A1929]">
      <style>{`
        :root {
          --ocean-deep: #0A1929;
          --ocean-mid: #1E3A5F;
          --coral: #FF6B6B;
          --coral-light: #FFA07A;
          --gold: #FFD700;
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
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center star-twinkle">
                <Sparkles className="w-5 h-5 text-[#0A1929]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Hōkū</h1>
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
                      ? "bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
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
        {/* Decorative stars background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
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
  );
}