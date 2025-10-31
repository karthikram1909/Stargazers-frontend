import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2, Navigation } from "lucide-react";

export default function StarCard({ star, onEdit, onDelete }) {
  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm hover:scale-105 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA07A] flex items-center justify-center">
              <Star className="w-5 h-5 text-[#0A1929]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">
                {star.hawaiian_name}
              </CardTitle>
              <p className="text-white/60 text-sm">{star.english_name}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-white/70 hover:text-red-400 hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {star.meaning && (
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              Meaning
            </p>
            <p className="text-white/90 text-sm leading-relaxed">
              {star.meaning}
            </p>
          </div>
        )}

        {star.navigation_use && (
          <div className="flex gap-2 items-start p-3 rounded-lg bg-white/5 border border-white/10">
            <Navigation className="w-4 h-4 text-[#FF6B6B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                Navigation Use
              </p>
              <p className="text-white/80 text-sm">
                {star.navigation_use}
              </p>
            </div>
          </div>
        )}

        {star.constellation && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-white/50 text-xs">Constellation</span>
            <span className="text-white/80 text-sm font-medium">
              {star.constellation}
            </span>
          </div>
        )}

        {star.best_viewing_months && (
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-xs">Best Viewing</span>
            <span className="text-white/80 text-sm">
              {star.best_viewing_months}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}