import { NextResponse } from "next/server";
import { updateParticipantState } from "@/lib/eventStore";
import type { EventStatus, Participant } from "@/types";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<{
    status: EventStatus;
    isOfficer: boolean;
    appNotes: string;
    carId: string | null;
    checkInState: Participant["checkInState"];
    preferredRidePartners: string[];
    driver: boolean;
    selfDriver: boolean;
    seats: number;
    sheetId: string;
  }>;

  const { sheetId, ...updates } = body;
  const data = await updateParticipantState(id, updates, sheetId);
  return NextResponse.json(data);
}
