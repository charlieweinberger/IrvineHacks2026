"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ParticipantPreferencesProps {
  preferredRidePartners: string[];
  onSave: (partners: string[]) => void;
}

export function ParticipantPreferences({
  preferredRidePartners,
  onSave,
}: ParticipantPreferencesProps) {
  const [partnersText, setPartnersText] = useState(
    preferredRidePartners.join(", ")
  );
  const [showEditInput, setShowEditInput] = useState(false);

  const handleSave = () => {
    const partners = partnersText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    onSave(partners);
    setShowEditInput(false);
  };

  const handleCancel = () => {
    setPartnersText(preferredRidePartners.join(", "));
    setShowEditInput(false);
  };

  return (
    <>
      {!showEditInput && (
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs">
            <span className="font-semibold text-zinc-700">
              Prefers to ride with:{" "}
            </span>
            <span className="text-zinc-600">
              {preferredRidePartners.length > 0
                ? preferredRidePartners.join(", ")
                : "None specified"}
            </span>
          </div>
          <button
            onClick={() => {
              setPartnersText(preferredRidePartners.join(", "));
              setShowEditInput(true);
            }}
            className="rounded-full p-1 hover:bg-zinc-100 transition-colors"
            aria-label="Edit rider preferences"
          >
            <Pencil className="h-4 w-4 text-zinc-500" />
          </button>
        </div>
      )}
      {showEditInput && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-700">
            Prefers to ride with:
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={partnersText}
              onChange={(e) => setPartnersText(e.target.value)}
              placeholder="Enter names separated by commas"
              autoFocus
            />
            <Button variant="secondary" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
