import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Sparkles, Plus, Search } from "lucide-react";
import StarCard from "../components/stars/StarCard";
import StarFormDialog from "../components/stars/StarFormDialog";

export default function Stars() {
  const [selectedStar, setSelectedStar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: stars, isLoading } = useQuery({
    queryKey: ['stars'],
    queryFn: async () => {
      const data = await base44.entities.Star.list();
      // Sort by brightness: dimmest to brightest (higher magnitude = dimmer, lower = brighter)
      return data.sort((a, b) => {
        // Stars without brightness go to the end
        if (a.brightness === null || a.brightness === undefined) return 1;
        if (b.brightness === null || b.brightness === undefined) return -1;
        // Sort descending (higher number = dimmer, so it comes first)
        return b.brightness - a.brightness;
      });
    },
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Star.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stars'] });
      setShowForm(false);
      setSelectedStar(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Star.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stars'] });
      setShowForm(false);
      setSelectedStar(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Star.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stars'] });
      setSelectedStar(null);
    },
  });

  const handleSave = (data) => {
    if (selectedStar) {
      updateMutation.mutate({ id: selectedStar.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (star) => {
    setSelectedStar(star);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this star from the guide?')) {
      deleteMutation.mutate(id);
    }
  };

  // Scroll to last viewed star on mount
  useEffect(() => {
    const lastViewedStarId = sessionStorage.getItem('lastViewedStarId');
    if (lastViewedStarId && stars.length > 0) {
      const element = document.getElementById(`star-${lastViewedStarId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      sessionStorage.removeItem('lastViewedStarId');
    }
  }, [stars]);

  // Filter stars based on search query
  const filteredStars = stars.filter(star => {
    const query = searchQuery.toLowerCase();
    return (
      star.hawaiian_name?.toLowerCase().includes(query) ||
      star.english_name?.toLowerCase().includes(query) ||
      star.constellation?.toLowerCase().includes(query) ||
      star.meaning?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Nā Hōkū - Star Guide
          </h1>
          <p className="text-white/70">
            Hawaiian names and meanings of celestial bodies
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedStar(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Star
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search by Hawaiian name, English name, constellation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm h-12 text-lg"
          />
        </div>
      </div>

      {/* Stars Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredStars.length === 0 ? (
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">
              {searchQuery ? "No stars found" : "No stars yet"}
            </h3>
            <p className="text-white/60 mb-6">
              {searchQuery 
                ? "Try a different search term" 
                : "Start building your Hawaiian star guide"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Add Your First Star
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStars.map((star) => (
            <StarCard
              key={star.id}
              star={star}
              onEdit={() => handleEdit(star)}
              onDelete={() => handleDelete(star.id)}
              id={`star-${star.id}`}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <StarFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        star={selectedStar}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}