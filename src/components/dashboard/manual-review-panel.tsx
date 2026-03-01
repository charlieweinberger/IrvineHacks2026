"use client";

import { useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Participant } from "@/types";

interface ManualReviewPanelProps {
  participants: Participant[];
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
}

export function ManualReviewPanel({
  participants,
  onUpdateParticipant,
}: ManualReviewPanelProps) {
  const [editingCapacity, setEditingCapacity] = useState<{
    [key: string]: number;
  }>({});
  const [editingPartners, setEditingPartners] = useState<{
    [key: string]: string;
  }>({});

  const needsReview = participants.filter(
    (p) =>
      (p.needsManualReviewDriverCapacity && !p.driverCapacityReviewApproved) ||
      (p.needsManualReviewNotes && !p.notesReviewApproved)
  );

  const handleCapacityChange = (participantId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditingCapacity((prev) => ({ ...prev, [participantId]: numValue }));
    }
  };

  const handleApproveCapacity = (participant: Participant) => {
    const newSeats = editingCapacity[participant.id] ?? participant.seats;
    onUpdateParticipant(participant.id, {
      seats: newSeats,
      driverCapacityReviewApproved: true,
    });
    setEditingCapacity((prev) => {
      const next = { ...prev };
      delete next[participant.id];
      return next;
    });
  };

  const handleApproveNotes = (participant: Participant) => {
    const partnersValue = editingPartners[participant.id];
    const newPartners =
      partnersValue !== undefined
        ? partnersValue
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : participant.preferredRidePartners;

    onUpdateParticipant(participant.id, {
      preferredRidePartners: newPartners,
      notesReviewApproved: true,
    });
    setEditingPartners((prev) => {
      const next = { ...prev };
      delete next[participant.id];
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Manual Review Needed
          {needsReview.length > 0 && (
            <Badge variant="warning">{needsReview.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {needsReview.length === 0 ? (
          <p className="text-sm text-zinc-500">No items need manual review</p>
        ) : (
          needsReview.map((participant) => (
            <div
              key={participant.id}
              className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-zinc-900">
                  {participant.name}
                </span>
              </div>

              {participant.needsManualReviewDriverCapacity &&
                !participant.driverCapacityReviewApproved && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="warning"
                        className="text-[10px] py-0 px-1.5"
                      >
                        Driver Capacity
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">Seats:</span>
                      <Input
                        type="number"
                        min="0"
                        value={
                          editingCapacity[participant.id] ?? participant.seats
                        }
                        onChange={(e) =>
                          handleCapacityChange(participant.id, e.target.value)
                        }
                        className="h-7 w-16 text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs"
                        onClick={() => handleApproveCapacity(participant)}
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </Button>
                    </div>
                  </div>
                )}

              {participant.needsManualReviewNotes &&
                !participant.notesReviewApproved && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="warning"
                        className="text-[10px] py-0 px-1.5"
                      >
                        Extra Comments
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-700 bg-white rounded p-2 border border-amber-200">
                      {participant.extraComments}
                    </p>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-600">
                        Prefers to ride with:
                      </label>
                      <Input
                        value={
                          editingPartners[participant.id] ??
                          (participant.preferredRidePartners || []).join(", ")
                        }
                        onChange={(e) =>
                          setEditingPartners((prev) => ({
                            ...prev,
                            [participant.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter names separated by commas"
                        className="h-7 text-xs"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      onClick={() => handleApproveNotes(participant)}
                    >
                      <Check className="h-3 w-3" />
                      Approve
                    </Button>
                  </div>
                )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
