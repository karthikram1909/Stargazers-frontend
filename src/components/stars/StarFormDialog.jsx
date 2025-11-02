
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

export default function StarFormDialog({ open, onOpenChange, star, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    hawaiian_name: "",
    english_name: "",
    meaning: "",
    navigation_use: "",
    best_viewing_months: "",
    constellation: "",
    brightness: null,
    pronunciation_audio_url: "", // Added
  });
  const [audioFile, setAudioFile] = useState(null); // Added
  const [uploading, setUploading] = useState(false); // Added

  useEffect(() => {
    if (star) {
      setFormData(star);
    } else {
      setFormData({
        hawaiian_name: "",
        english_name: "",
        meaning: "",
        navigation_use: "",
        best_viewing_months: "",
        constellation: "",
        brightness: null,
        pronunciation_audio_url: "", // Added
      });
    }
    setAudioFile(null); // Added
  }, [star, open]);

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Assuming 'base44' is globally available or imported elsewhere in the project.
      // If 'base44' is not defined, this line will cause an error.
      // A common pattern is to pass this utility as a prop or import it directly.
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, pronunciation_audio_url: result.file_url });
      setAudioFile(file); // Stores the local file object, though URL is what's typically saved
    } catch (error) {
      console.error("Error uploading audio:", error);
      // Optionally, show an error message to the user
    } finally {
      setUploading(false);
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
            {star ? "Edit Star" : "Add New Star"}
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
                placeholder="Hōkūleʻa"
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
                placeholder="Arcturus"
              />
            </div>
          </div>

          {/* New Audio Upload Section */}
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
                disabled={uploading} // Disable input while uploading
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4"
              />
              {uploading && <span className="text-white/60 text-sm">Uploading...</span>}
            </div>
            {formData.pronunciation_audio_url && (
              <p className="text-[#FFD700] text-xs mt-1">✓ Audio file uploaded</p>
            )}
          </div>
          {/* End New Audio Upload Section */}

          <div>
            <Label htmlFor="meaning" className="text-white/90">
              Meaning & Significance
            </Label>
            <Textarea
              id="meaning"
              value={formData.meaning}
              onChange={(e) =>
                setFormData({ ...formData, meaning: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-24"
              placeholder="Cultural meaning and significance..."
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
              placeholder="How this star was used in traditional wayfinding..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="constellation" className="text-white/90">
                Constellation
              </Label>
              <Input
                id="constellation"
                value={formData.constellation}
                onChange={(e) =>
                  setFormData({ ...formData, constellation: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="Boötes"
              />
            </div>
            <div>
              <Label htmlFor="brightness" className="text-white/90">
                Magnitude (Brightness)
              </Label>
              <Input
                id="brightness"
                type="number"
                step="0.01"
                value={formData.brightness ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    brightness: val === "" ? null : parseFloat(val)
                  });
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                placeholder="e.g., -1.46 or 2.5"
              />
              <p className="text-white/50 text-xs mt-1">Lower = brighter (e.g., -1.46 for Sirius, +2.5 for dim stars)</p>
            </div>
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
              placeholder="April - June"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || uploading} // Disable if uploading
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading} // Disable if uploading
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : (uploading ? "Uploading Audio..." : "Save Star")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
