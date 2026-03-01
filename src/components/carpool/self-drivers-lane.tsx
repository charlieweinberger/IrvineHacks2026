"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreferredPartnersTooltip } from "@/components/shared/preferred-partners-tooltip";
import { PaidMemberIcon } from "@/components/shared/paid-member-icon";
import {
  getStatusBorderColor,
  getStatusDarkTextColor,
  getStatusLightBgColor,
} from "@/lib/statusColors";
import { cn } from "@/lib/utils";
import type { Participant } from "@/types";

interface SelfDriversLaneProps {
  selfDrivers: Participant[];
}

export function SelfDriversLane({ selfDrivers }: SelfDriversLaneProps) {
  return (
    <Card className="min-h-40 border-2 border-zinc-200">
      <CardHeader>
        <CardTitle>Self-Drivers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {selfDrivers.map((participant) => (
          <div
            key={participant.id}
            className={cn(
              "w-full rounded-md border-2 p-2 text-left text-sm flex items-center justify-between gap-2",
              getStatusBorderColor(participant.status),
              getStatusLightBgColor(participant.status),
            )}
          >
            <span className={cn("flex items-center gap-1", getStatusDarkTextColor(participant.status))}>
              {participant.name}
              {participant.isPaidMember && (
                <PaidMemberIcon size="small" />
              )}
            </span>
            <PreferredPartnersTooltip participant={participant} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
