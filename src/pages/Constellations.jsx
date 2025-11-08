
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stars, Plus, Trash2, Volume2, Search, ZoomIn } from "lucide-react";
import ConstellationFormDialog from "../components/constellations/ConstellationFormDialog";
import ImageModal from "../components/ImageModal";

export default function Constellations() {
  const queryClient = useQueryClient();
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });

  const { data: constellations, isLoading } = useQuery({
    queryKey: ['constellations'],
    queryFn: async () => {
      const data = await base44.entities.Constellation.list();
      return data.sort((a, b) => a.hawaiian_name.localeCompare(b.hawaiian_name));
    },
    initialData: [],
  });

  const constellationIconUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690537046186188fdedaa7d0/956757e39_IMG_2167.jpeg";

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Constellation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['constellations'] });
      setShowForm(false);
      setSelectedConstellation(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Constellation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['constellations'] });
      setShowForm(false);
      setSelectedConstellation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Constellation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['constellations'] });
    },
  });

  const playPronunciation = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleSave = (data) => {
    if (selectedConstellation) {
      updateMutation.mutate({ id: selectedConstellation.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (constellation) => {
    setSelectedConstellation(constellation);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this constellation from the guide?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageClick = (imageUrl, constellationName) => {
    setSelectedImage({ url: imageUrl, title: constellationName });
    setImageModalOpen(true);
  };

  const filteredConstellations = constellations.filter(constellation => {
    const query = searchQuery.toLowerCase();
    return (
      constellation.hawaiian_name?.toLowerCase().includes(query) ||
      constellation.english_name?.toLowerCase().includes(query) ||
      constellation.meaning?.toLowerCase().includes(query) ||
      constellation.mythology?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto md:mx-0 mb-4">
            <img 
              src={constellationIconUrl}
              alt="Constellation"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Constellation Guide
          </h1>
          <p className="text-white/70 text-lg">
            Hawaiian star patterns and their navigation significance
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedConstellation(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Constellation
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
            Constellations served as celestial roadmaps for Hawaiian navigators, helping them 
            maintain course across thousands of miles of open ocean. Each constellation had its 
            own name, mythology, and practical navigation use, passed down through generations 
            of wayfinders.
          </p>
        </CardContent>
      </Card>

      {/* Constellations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredConstellations.length === 0 ? (
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-4 opacity-30">
              <img 
                src={constellationIconUrl}
                alt="Constellation"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl text-white mb-2">
              {searchQuery ? "No constellations found" : "No constellations yet"}
            </h3>
            <p className="text-white/60 mb-6">
              {searchQuery 
                ? "Try a different search term" 
                : "Start building your Hawaiian constellation guide"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Add Your First Constellation
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredConstellations.map((constellation) => (
            <Card
              key={constellation.id}
              className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-all overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {constellation.image_url ? (
                    <div 
                      className="flex-shrink-0 relative cursor-pointer group"
                      onClick={() => handleImageClick(constellation.image_url, constellation.hawaiian_name)}
                    >
                      <img 
                        src={constellation.image_url} 
                        alt={constellation.hawaiian_name}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-white/20"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/30">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
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
                          src={constellationIconUrl}
                          alt="Constellation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">
                          {constellation.hawaiian_name}
                        </h3>
                        {constellation.pronunciation_audio_url && (
                          <button
                            onClick={() => playPronunciation(constellation.pronunciation_audio_url)}
                            className="text-[#0EA5E9] hover:text-[#60A5FA] transition-colors"
                            title="Play pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-white/60 text-base">
                        {constellation.english_name}
                      </p>
                      {constellation.meaning && (
                        <p className="text-[#60A5FA] text-base italic mt-1">
                          {constellation.meaning}
                        </p>
                      )}
                    </div>

                    {constellation.stars_description && (
                      <div className="mb-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Stars
                        </p>
                        <p className="text-white/80 text-base">
                          {constellation.stars_description}
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      {constellation.navigation_use && (
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            Navigation Use
                          </p>
                          <p className="text-white/80 text-base">
                            {constellation.navigation_use}
                          </p>
                        </div>
                      )}
                      {constellation.best_viewing_months && (
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            Best Viewing
                          </p>
                          <p className="text-white/80 text-base">
                            {constellation.best_viewing_months}
                          </p>
                        </div>
                      )}
                    </div>

                    {constellation.mythology && (
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Mythology
                        </p>
                        <p className="text-white/90 text-base leading-relaxed">
                          {constellation.mythology}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => handleEdit(constellation)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-red-400 hover:bg-white/10"
                      onClick={() => handleDelete(constellation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cultural Note */}
      <Card className="mt-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 border-[#60A5FA]/30">
        <CardContent className="p-6">
          <p className="text-white/90 italic leading-relaxed">
            "The stars served as a celestial map, with constellations marking key directions 
            and latitudes. Master navigators memorized the rising and setting positions of 
            entire star groups, creating a mental framework that guided voyages across the Pacific."
          </p>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ConstellationFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        constellation={selectedConstellation}
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
