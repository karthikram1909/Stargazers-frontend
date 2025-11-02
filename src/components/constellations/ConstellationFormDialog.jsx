import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function ConstellationFormDialog({ open, onOpenChange, constellation, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    hawaiian_name: "",
    english_name: "",
    meaning: "",
    stars_description: "",
    navigation_use: "",
    best_viewing_months: "",
    mythology: "",
  });

  useEffect(() => {
    if (constellation) {
      setFormData(constellation);
    } else {
      setFormData({
        hawaiian_name: "",
        english_name: "",
        meaning: "",
        stars_description: "",
        navigation_use: "",
        best_viewing_months: "",
        mythology: "",
      });
    }
  }, [constellation, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E3A5F] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {constellation ? "Edit Constellation" : "Add New Constellation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hawaiian_name" className="text-white/90">
                Hawaiian Name *
              </Label>
              <Input
                id="hawaiian_name"
                value={formData.hawaiian_name}
                onChange={(e) =>
                  setFormData({ ...formData, hawaiian_name: e.target.value })
                }
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Makaliʻi"
              />
            </div>
            <div>
              <Label htmlFor="english_name" className="text-white/90">
                English Name *
              </Label>
              <Input
                id="english_name"
                value={formData.english_name}
                onChange={(e) =>
                  setFormData({ ...formData, english_name: e.target.value })
                }
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Pleiades"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="meaning" className="text-white/90">
              Meaning
            </Label>
            <Input
              id="meaning"
              value={formData.meaning}
              onChange={(e) =>
                setFormData({ ...formData, meaning: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              placeholder="Eyes of the Chief"
            />
          </div>

          <div>
            <Label htmlFor="stars_description" className="text-white/90">
              Stars Description
            </Label>
            <Textarea
              id="stars_description"
              value={formData.stars_description}
              onChange={(e) =>
                setFormData({ ...formData, stars_description: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              placeholder="Description of the stars that make up this constellation..."
            />
          </div>

          <div>
            <Label htmlFor="navigation_use" className="text-white/90">
              Navigation Use
            </Label>
            <Textarea
              id="navigation_use"
              value={formData.navigation_use}
              onChange={(e) =>
                setFormData({ ...formData, navigation_use: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              placeholder="How this constellation was used in traditional wayfinding..."
            />
          </div>

          <div>
            <Label htmlFor="best_viewing_months" className="text-white/90">
              Best Viewing Months
            </Label>
            <Input
              id="best_viewing_months"
              value={formData.best_viewing_months}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  best_viewing_months: e.target.value,
                })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              placeholder="November - March"
            />
          </div>

          <div>
            <Label htmlFor="mythology" className="text-white/90">
              Mythology
            </Label>
            <Textarea
              id="mythology"
              value={formData.mythology}
              onChange={(e) =>
                setFormData({ ...formData, mythology: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-24"
              placeholder="Hawaiian mythology and stories about this constellation..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Constellation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}