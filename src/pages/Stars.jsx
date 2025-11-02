
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Plus } from "lucide-react";
import StarCard from "../components/stars/StarCard";
import StarFormDialog from "../components/stars/StarFormDialog";

export default function Stars() {
  const [selectedStar, setSelectedStar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: stars, isLoading } = useQuery({
    queryKey: ['stars'],
    queryFn: async () => {
      const data = await base44.entities.Star.list();
      return data.sort((a, b) => a.hawaiian_name.localeCompare(b.hawaiian_name));
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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
          className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Star
        </Button>
      </div>

      {/* Stars Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : stars.length === 0 ? (
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No stars yet</h3>
            <p className="text-white/60 mb-6">
              Start building your Hawaiian star guide
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A]"
            >
              Add Your First Star
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stars.map((star) => (
            <StarCard
              key={star.id}
              star={star}
              onEdit={() => handleEdit(star)}
              onDelete={() => handleDelete(star.id)}
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
