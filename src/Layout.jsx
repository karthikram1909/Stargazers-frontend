
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, Moon, Compass, Globe, Map, Stars, Type, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState('normal');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all searchable data
  const { data: stars } = useQuery({
    queryKey: ['stars'],
    queryFn: () => base44.entities.Star.list(),
    initialData: [],
  });

  const { data: planets } = useQuery({
    queryKey: ['planets'],
    queryFn: () => base44.entities.Planet.list(),
    initialData: [],
  });

  const { data: constellations } = useQuery({
    queryKey: ['constellations'],
    queryFn: () => base44.entities.Constellation.list(),
    initialData: [],
  });

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    setFontSize(savedFontSize);
    document.documentElement.setAttribute('data-font-size', savedFontSize);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ensure the clicked element is not inside the search container or the search button itself
      if (searchOpen && !e.target.closest('.search-container')) {
        setSearchOpen(false);
        // Removed setSearchQuery(""); as per outline - it will clear on ESC, but not on outside click
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Close search on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [searchOpen]);

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

  // Search filtering
  const filteredStars = stars.filter(star => {
    const query = searchQuery.toLowerCase();
    return searchQuery.length > 0 && (
      star.hawaiian_name?.toLowerCase().includes(query) ||
      star.english_name?.toLowerCase().includes(query) ||
      star.meaning?.toLowerCase().includes(query) ||
      star.constellation?.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const filteredPlanets = planets.filter(planet => {
    const query = searchQuery.toLowerCase();
    return searchQuery.length > 0 && (
      planet.hawaiian_name?.toLowerCase().includes(query) ||
      planet.english_name?.toLowerCase().includes(query) ||
      planet.meaning?.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const filteredConstellations = constellations.filter(constellation => {
    const query = searchQuery.toLowerCase();
    return searchQuery.length > 0 && (
      constellation.hawaiian_name?.toLowerCase().includes(query) ||
      constellation.english_name?.toLowerCase().includes(query) ||
      constellation.meaning?.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const hasResults = filteredStars.length > 0 || filteredPlanets.length > 0 || filteredConstellations.length > 0;

  const handleNavigateToStar = (star) => {
    navigate(`${createPageUrl("StarDetail")}?id=${star.id}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleNavigateToPage = (pageName) => {
    navigate(createPageUrl(pageName));
    setSearchOpen(false);
    setSearchQuery("");
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
      
      {/* Overlay - Lightened so couple is visible */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.25), rgba(0,0,0,0.35))',
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
              {/* Search Button with Dropdown */}
              <div className="relative search-container">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap bg-white/10 text-white/70 hover:bg-white/20 backdrop-blur-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
                
                {/* Search Dropdown */}
                {searchOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[90vw] max-w-2xl bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Search stars, planets, constellations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 text-base focus:ring-1 focus:ring-[#60A5FA] focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery("");
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-[70vh] overflow-y-auto">
                      {!searchQuery ? (
                        <div className="p-8 text-center">
                          <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                          <p className="text-white/60">Start typing to search</p>
                        </div>
                      ) : !hasResults ? (
                        <div className="p-8 text-center">
                          <p className="text-white/60">No results found</p>
                        </div>
                      ) : (
                        <div className="p-4 space-y-6">
                          {/* Stars Results */}
                          {filteredStars.length > 0 && (
                            <div>
                              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2 px-2">Stars</h3>
                              <div className="space-y-1">
                                {filteredStars.map((star) => (
                                  <button
                                    key={star.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNavigateToStar(star);
                                    }}
                                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                                        <Stars className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{star.hawaiian_name}</p>
                                        <p className="text-white/60 text-sm truncate">{star.english_name}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              {/* Check total results to show "View all" */}
                              {stars.filter(s => {
                                const q = searchQuery.toLowerCase();
                                return (s.hawaiian_name?.toLowerCase().includes(q) || s.english_name?.toLowerCase().includes(q) || s.meaning?.toLowerCase().includes(q) || s.constellation?.toLowerCase().includes(q));
                              }).length > 5 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigateToPage("Stars");
                                  }}
                                  className="w-full text-center py-2 text-[#60A5FA] hover:text-white text-sm mt-2"
                                >
                                  View all stars →
                                </button>
                              )}
                            </div>
                          )}

                          {/* Planets Results */}
                          {filteredPlanets.length > 0 && (
                            <div>
                              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2 px-2">Planets</h3>
                              <div className="space-y-1">
                                {filteredPlanets.map((planet) => (
                                  <button
                                    key={planet.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNavigateToPage("Planets");
                                    }}
                                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{planet.hawaiian_name}</p>
                                        <p className="text-white/60 text-sm truncate">{planet.english_name}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              {/* Check total results to show "View all" */}
                              {planets.filter(p => {
                                const q = searchQuery.toLowerCase();
                                return (p.hawaiian_name?.toLowerCase().includes(q) || p.english_name?.toLowerCase().includes(q) || p.meaning?.toLowerCase().includes(q));
                              }).length > 5 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigateToPage("Planets");
                                  }}
                                  className="w-full text-center py-2 text-[#60A5FA] hover:text-white text-sm mt-2"
                                >
                                  View all planets →
                                </button>
                              )}
                            </div>
                          )}

                          {/* Constellations Results */}
                          {filteredConstellations.length > 0 && (
                            <div>
                              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2 px-2">Constellations</h3>
                              <div className="space-y-1">
                                {filteredConstellations.map((constellation) => (
                                  <button
                                    key={constellation.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNavigateToPage("Constellations");
                                    }}
                                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                                        <Stars className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{constellation.hawaiian_name}</p>
                                        <p className="text-white/60 text-sm truncate">{constellation.english_name}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              {/* Check total results to show "View all" */}
                              {constellations.filter(c => {
                                const q = searchQuery.toLowerCase();
                                return (c.hawaiian_name?.toLowerCase().includes(q) || c.english_name?.toLowerCase().includes(q) || c.meaning?.toLowerCase().includes(q));
                              }).length > 5 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigateToPage("Constellations");
                                  }}
                                  className="w-full text-center py-2 text-[#60A5FA] hover:text-white text-sm mt-2"
                                >
                                  View all constellations →
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
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
