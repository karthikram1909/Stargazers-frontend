import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Volume2, Search, Plus, Edit, Trash2, Sparkles, ZoomIn } from "lucide-react";
import PlanetFormDialog from "../components/planets/PlanetFormDialog";
import ImageModal from "../components/ImageModal";

export default function Planets() {
  const queryClient = useQueryClient();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });
  const [playingAudio, setPlayingAudio] = useState(null);

  const { data: allPlanets, isLoading } = useQuery({
    queryKey: ['planets'],
    queryFn: async () => {
      const data = await base44.entities.Planet.list();
      // Sort planets in order from the Sun
      const planetOrder = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
      return data.sort((a, b) => {
        const orderA = planetOrder.indexOf(a.english_name);
        const orderB = planetOrder.indexOf(b.english_name);
        // If planet not in order list, put it at the end
        if (orderA === -1 && orderB === -1) {
            // Both not in the list, sort by Hawaiian name
            return a.hawaiian_name.localeCompare(b.hawaiian_name);
        }
        if (orderA === -1) return 1; // a is not in list, b is (or is also not in list but handled by previous condition)
        if (orderB === -1) return -1; // b is not in list, a is
        return orderA - orderB; // Both are in the list, sort by their order
      });
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Planet.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planets'] });
      setShowForm(false);
      setSelectedPlanet(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Planet.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planets'] });
      setShowForm(false);
      setSelectedPlanet(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Planet.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planets'] });
    },
  });

  const handleSave = (data) => {
    if (selectedPlanet) {
      updateMutation.mutate({ id: selectedPlanet.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (planet) => {
    setSelectedPlanet(planet);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this planet from the guide?')) {
      deleteMutation.mutate(id);
    }
  };

  const playPronunciation = (audioUrl, planetId) => {
    if (audioUrl && playingAudio !== planetId) {
      setPlayingAudio(planetId);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => setPlayingAudio(null);
    }
  };

  const handleImageClick = (imageUrl, planetName) => {
    setSelectedImage({ url: imageUrl, title: planetName });
    setImageModalOpen(true);
  };

  const planets = allPlanets.filter(p => p.type === 'planet');
  const dwarfPlanets = allPlanets.filter(p => p.type === 'dwarf_planet');

  // Filter planets based on search
  const filteredPlanets = planets.filter(planet => {
    const query = searchQuery.toLowerCase();
    return (
      planet.hawaiian_name?.toLowerCase().includes(query) ||
      planet.english_name?.toLowerCase().includes(query) ||
      planet.meaning?.toLowerCase().includes(query) ||
      planet.mythology?.toLowerCase().includes(query)
    );
  });

  const filteredDwarfPlanets = dwarfPlanets.filter(planet => {
    const query = searchQuery.toLowerCase();
    return (
      planet.hawaiian_name?.toLowerCase().includes(query) ||
      planet.english_name?.toLowerCase().includes(query) ||
      planet.meaning?.toLowerCase().includes(query) ||
      planet.mythology?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto md:mx-0 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/12ba6bacb_planetsicon.jpeg"
              alt="Planets"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Nā Hōkūhele - The Wandering Stars
          </h1>
          <p className="text-white/70 text-lg">
            Planets and their Hawaiian names
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPlanet(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Planet
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search by Hawaiian name, English name, mythology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm h-12 text-lg"
          />
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-12 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
        <CardContent className="p-8">
          <p className="text-white/90 text-xl leading-relaxed">
            Ancient Hawaiians called planets "hōkūhele" meaning "wandering stars" because they moved 
            against the fixed backdrop of stars. These celestial wanderers were observed closely and 
            incorporated into navigation, agriculture, and cultural practices.
          </p>
        </CardContent>
      </Card>

      {/* Planets */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredPlanets.length === 0 && filteredDwarfPlanets.length === 0 ? (
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/12ba6bacb_planetsicon.jpeg"
                alt="Planets"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <h3 className="text-xl text-white mb-2">
              {searchQuery ? "No planets found" : "No planets yet"}
            </h3>
            <p className="text-white/60 mb-6">
              {searchQuery 
                ? "Try a different search term" 
                : "Start building your Hawaiian planet guide"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Add Your First Planet
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Major Planets */}
          {filteredPlanets.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-white/70" />
                Planets
              </h2>
              <div className="space-y-4">
                {filteredPlanets.map((planet) => (
                  <Card
                    key={planet.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-[1.01] transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {planet.image_url ? (
                          <div 
                            className="flex-shrink-0 relative cursor-pointer group"
                            onClick={() => handleImageClick(planet.image_url, planet.hawaiian_name)}
                          >
                            <img 
                              src={planet.image_url} 
                              alt={planet.hawaiian_name}
                              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-2 border-white/20 shadow-lg"
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
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                              <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/12ba6bacb_planetsicon.jpeg"
                                alt="Planet"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold text-lg">
                                {planet.hawaiian_name}
                              </h3>
                              {planet.pronunciation_audio_url && (
                                <button
                                  onClick={() => playPronunciation(planet.pronunciation_audio_url, planet.id)}
                                  disabled={playingAudio === planet.id}
                                  className={`transition-all ${
                                    playingAudio === planet.id
                                      ? 'text-white scale-90'
                                      : 'text-[#0EA5E9] hover:text-[#60A5FA] active:scale-90'
                                  }`}
                                  title="Play pronunciation"
                                >
                                  <Volume2 className="w-8 h-8" />
                                </button>
                              )}
                            </div>
                            <p className="text-white/60 text-base">
                              {planet.english_name}
                            </p>
                            {planet.meaning && (
                              <p className="text-[#60A5FA] text-base italic mt-1">
                                {planet.meaning}
                              </p>
                            )}
                          </div>

                          {planet.description && (
                            <div className="mb-3">
                              <p className="text-white/80 text-base leading-relaxed">
                                {planet.description}
                              </p>
                            </div>
                          )}

                          {planet.mythology && (
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Mythology & Cultural References
                              </p>
                              <p className="text-white/90 text-base leading-relaxed">
                                {planet.mythology}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleEdit(planet)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-red-400 hover:bg-white/10"
                            onClick={() => handleDelete(planet.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Dwarf Planets */}
          {filteredDwarfPlanets.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#60A5FA]" />
                Dwarf Planets
              </h2>
              <p className="text-white/70 mb-6">
                Small planetary-mass objects that orbit the Sun but haven't cleared their orbital paths
              </p>
              <div className="space-y-4">
                {filteredDwarfPlanets.map((planet) => (
                  <Card
                    key={planet.id}
                    className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-[1.01] transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {planet.image_url ? (
                          <div 
                            className="flex-shrink-0 relative cursor-pointer group"
                            onClick={() => handleImageClick(planet.image_url, planet.hawaiian_name)}
                          >
                            <img 
                              src={planet.image_url} 
                              alt={planet.hawaiian_name}
                              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-2 border-white/20 shadow-lg"
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
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                              <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/12ba6bacb_planetsicon.jpeg"
                                alt="Planet"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg">
                                  {planet.hawaiian_name}
                                </h3>
                                {planet.pronunciation_audio_url && (
                                  <button
                                    onClick={() => playPronunciation(planet.pronunciation_audio_url, planet.id)}
                                    disabled={playingAudio === planet.id}
                                    className={`transition-all ${
                                      playingAudio === planet.id
                                        ? 'text-white scale-90'
                                        : 'text-[#0EA5E9] hover:text-[#60A5FA] active:scale-90'
                                    }`}
                                    title="Play pronunciation"
                                  >
                                    <Volume2 className="w-8 h-8" />
                                  </button>
                                )}
                              </div>
                              <p className="text-white/60 text-base">
                                {planet.english_name}
                              </p>
                              {planet.meaning && (
                                <p className="text-[#60A5FA] text-base italic mt-1">
                                  {planet.meaning}
                                </p>
                              )}
                            </div>
                            <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30">
                              Dwarf
                            </Badge>
                          </div>

                          {planet.description && (
                            <div className="mb-3">
                              <p className="text-white/80 text-base leading-relaxed">
                                {planet.description}
                              </p>
                            </div>
                          )}

                          {planet.mythology && (
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-white/50 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Mythology & Cultural References
                              </p>
                              <p className="text-white/90 text-base leading-relaxed">
                                {planet.mythology}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleEdit(planet)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-red-400 hover:bg-white/10"
                            onClick={() => handleDelete(planet.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Form Dialog */}
      <PlanetFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        planet={selectedPlanet}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

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