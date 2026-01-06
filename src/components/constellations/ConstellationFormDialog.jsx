
import React, { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client"; // REMOVED
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
    pronunciation_audio_url: "",
    image_url: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
        pronunciation_audio_url: "",
        image_url: "",
      });
    }
    setAudioFile(null); // Reset audio file state when constellation changes or dialog opens
  }, [constellation, open]);

  const handleAudioUpload = async (e) => {
    /*
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Assuming base44.integrations.Core.UploadFile is available in the global scope or imported
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, pronunciation_audio_url: result.file_url });
      setAudioFile(file); // Keep track of the file object if needed, though URL is what's saved
    } catch (error) {
      console.error("Error uploading audio:", error);
      // Optionally, show an error message to the user
    } finally {
      setUploading(false);
    }
    */
    console.log("Audio upload disabled");
  };

  const handleImageUpload = async (e) => {
    /*
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: result.file_url });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
    */
    console.log("Image upload disabled");
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
            <Label htmlFor="image" className="text-white/90">
              Constellation Image
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
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4 hover:file:bg-white/30"
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
              {isLoading ? "Saving..." : (uploading || uploadingImage ? "Uploading..." : "Save Constellation")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
