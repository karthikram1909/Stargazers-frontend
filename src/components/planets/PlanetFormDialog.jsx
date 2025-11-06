import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function PlanetFormDialog({ open, onOpenChange, planet, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    hawaiian_name: "",
    english_name: "",
    type: "planet",
    meaning: "",
    description: "",
    mythology: "",
    pronunciation_audio_url: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (planet && open) {
      setFormData(planet);
    } else if (!open) {
      setFormData({
        hawaiian_name: "",
        english_name: "",
        type: "planet",
        meaning: "",
        description: "",
        mythology: "",
        pronunciation_audio_url: "",
        image_url: "",
      });
    }
  }, [planet, open]);

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, pronunciation_audio_url: result.file_url }));
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: result.file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E3A5F] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {planet ? "Edit Planet" : "Add New Planet"}
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
                  setFormData(prev => ({ ...prev, hawaiian_name: e.target.value }))
                }
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Hōkūloa"
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
                  setFormData(prev => ({ ...prev, english_name: e.target.value }))
                }
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Venus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type" className="text-white/90">
              Type *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planet">Planet</SelectItem>
                <SelectItem value="dwarf_planet">Dwarf Planet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image" className="text-white/90">
              Planet Image
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || isLoading}
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4"
              />
              {uploadingImage && <span className="text-white/60 text-sm">Uploading...</span>}
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <p className="text-[#FFD700] text-xs mb-2">✓ Image uploaded</p>
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-white/20"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="audio" className="text-white/90">
              Pronunciation Audio
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                disabled={uploading || isLoading}
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4"
              />
              {uploading && <span className="text-white/60 text-sm">Uploading...</span>}
            </div>
            {formData.pronunciation_audio_url && (
              <p className="text-[#FFD700] text-xs mt-1">✓ Audio file uploaded</p>
            )}
          </div>

          <div>
            <Label htmlFor="meaning" className="text-white/90">
              Meaning
            </Label>
            <Input
              id="meaning"
              value={formData.meaning}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, meaning: e.target.value }))
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              placeholder="The bright one, morning star"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white/90">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-24"
              placeholder="Scientific and cultural information about this planet..."
            />
          </div>

          <div>
            <Label htmlFor="mythology" className="text-white/90">
              Mythology & Cultural References
            </Label>
            <Textarea
              id="mythology"
              value={formData.mythology}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, mythology: e.target.value }))
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-32"
              placeholder="Hawaiian, Greek, Roman mythology and cultural significance..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || uploading || uploadingImage}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading || uploadingImage}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : (uploading || uploadingImage ? "Uploading..." : "Save Planet")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}