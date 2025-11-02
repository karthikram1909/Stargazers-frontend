import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stars, Plus, Trash2 } from "lucide-react";
import ConstellationFormDialog from "../components/constellations/ConstellationFormDialog";

export default function Constellations() {
  const queryClient = useQueryClient();
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: constellations, isLoading } = useQuery({
    queryKey: ['constellations'],
    queryFn: async () => {
      const data = await base44.entities.Constellation.list();
      return data.sort((a, b) => a.hawaiian_name.localeCompare(b.hawaiian_name));
    },
    initialData: [],
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center mx-auto md:mx-0 mb-4">
            <Stars className="w-8 h-8 text-[#0A1929]" />
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
          className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Constellation
        </Button>
      </div>

      {/* Introduction */}
      <Card className="mb-12 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
        <CardContent className="p-8">
          <p className="text-white/90 text-lg leading-relaxed">
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
      ) : constellations.length === 0 ? (
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <Stars className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No constellations yet</h3>
            <p className="text-white/60 mb-6">
              Start building your Hawaiian constellation guide
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A]"
            >
              Add Your First Constellation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {constellations.map((constellation) => (
            <Card
              key={constellation.id}
              className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center">
                      <Stars className="w-6 h-6 text-[#0A1929]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {constellation.hawaiian_name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {constellation.english_name}
                      </p>
                      {constellation.meaning && (
                        <p className="text-[#FFA07A] text-sm italic mt-1">
                          {constellation.meaning}
                        </p>
                      )}
                    </div>

                    {constellation.stars_description && (
                      <div className="mb-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                          Stars
                        </p>
                        <p className="text-white/80 text-sm">
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
                          <p className="text-white/80 text-sm">
                            {constellation.navigation_use}
                          </p>
                        </div>
                      )}
                      {constellation.best_viewing_months && (
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            Best Viewing
                          </p>
                          <p className="text-white/80 text-sm">
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
                        <p className="text-white/90 text-sm leading-relaxed">
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
      <Card className="mt-12 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FFA07A]/20 border-[#FFA07A]/30">
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
    </div>
  );
}