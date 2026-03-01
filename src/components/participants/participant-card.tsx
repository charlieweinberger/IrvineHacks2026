"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTimeline } from "@/components/participants/status-timeline";
import { ParticipantNotes } from "@/components/participants/participant-notes";
import { ParticipantPreferences } from "@/components/participants/participant-preferences";
import { ParticipantRoleBadges } from "@/components/participants/participant-role-badges";
import type { EventStatus, Participant } from "@/types";

export function ParticipantCard({
  participant,
  onStatusChange,
  onSaveNotes,
  onSavePreferences,
}: {
  participant: Participant;
  onStatusChange: (id: string, status: EventStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onSavePreferences: (id: string, partners: string[]) => void;
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>{participant.name}</CardTitle>
          <p className="text-xs text-zinc-500">{participant.email}</p>
          <p className="text-xs text-zinc-500">{participant.phone}</p>
        </div>
        <ParticipantRoleBadges participant={participant} />
      </CardHeader>
      <CardContent className="space-y-3">
        <StatusTimeline
          status={participant.status}
          onChange={(status) => onStatusChange(participant.id, status)}
        />
        <ParticipantPreferences
          preferredRidePartners={participant.preferredRidePartners || []}
          onSave={(partners) => onSavePreferences(participant.id, partners)}
        />
        <ParticipantNotes
          extraComments={participant.extraComments}
          appNotes={participant.appNotes}
          onSave={(notes) => onSaveNotes(participant.id, notes)}
        />
      </CardContent>
    </Card>
  );
}
