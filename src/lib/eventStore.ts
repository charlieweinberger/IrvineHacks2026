import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { cars, participantState } from "@/lib/db/schema";
import { fetchSheetParticipants } from "@/lib/googleSheets";
import { generateMockInsights } from "@/lib/aiInsights";
import { optimizeCarpoolAssignments } from "@/lib/carpoolOptimizer";
import { isOfficerEmail } from "@/lib/config";
import type { DashboardStats, EventData, EventStatus, Participant } from "@/types";

function toParticipant(
  sheet: Awaited<ReturnType<typeof fetchSheetParticipants>>[number],
  local?: {
    status: string;
    isOfficer: boolean;
    appNotes: string;
    carId: string | null;
    checkInState: string | null;
  },
): Participant {
  // Auto-determine officer status based on email
  const isOfficer = isOfficerEmail(sheet.email);

  return {
    ...sheet,
    status: (local?.status as EventStatus) ?? "awaiting",
    isOfficer,
    appNotes: local?.appNotes ?? "",
    carId: local?.carId ?? null,
    checkInState: (local?.checkInState as Participant["checkInState"]) ?? null,
  };
}

export async function syncFromSheet() {
  const sheetParticipants = await fetchSheetParticipants();

  for (const participant of sheetParticipants) {
    const existing = await db
      .select()
      .from(participantState)
      .where(eq(participantState.participantId, participant.id));

    if (existing.length === 0) {
      await db.insert(participantState).values({
        participantId: participant.id,
        email: participant.email,
        status: "awaiting",
        isOfficer: false,
        appNotes: "",
        carId: null,
        checkInState: null,
        updatedAt: new Date(),
      });
    }
  }

  const locals = await db.select().from(participantState);
  const localById = new Map(locals.map((row) => [row.participantId, row]));

  return sheetParticipants.map((sheet) =>
    toParticipant(sheet, localById.get(sheet.id)),
  );
}

function buildCars(participants: Participant[]) {
  const driverCars = participants
    .filter((p) => p.driver && p.status !== "cancelled" && p.seats > 0)
    .map((driver) => {
      const riderIds = participants
        .filter((p) => p.carId === `car-${driver.id}`)
        .map((p) => p.id);

      return {
        id: `car-${driver.id}`,
        driverId: driver.id,
        driverName: driver.name,
        seatsTotal: driver.seats,
        seatsUsed: riderIds.length,
        riderIds,
      };
    });

  return driverCars;
}

function buildStats(participants: Participant[]): DashboardStats {
  const totalSignedUp = participants.length;
  const confirmed = participants.filter((p) => p.status === "confirmed").length;
  const cancelled = participants.filter((p) => p.status === "cancelled").length;
  const awaitingResponse = participants.filter((p) => p.status === "awaiting").length;
  const carsCreated = participants.filter((p) => p.driver && p.seats > 0).length;
  const officersAttending = participants.filter(
    (p) => p.isOfficer && p.status !== "cancelled",
  ).length;

  return {
    totalSignedUp,
    confirmed,
    cancelled,
    awaitingResponse,
    carsCreated,
    officersAttending,
  };
}

export async function getEventData(): Promise<EventData> {
  const participants = await syncFromSheet();
  const cars = buildCars(participants);
  const stats = buildStats(participants);
  const insights = generateMockInsights(participants);

  return { participants, cars, stats, insights };
}

export async function updateParticipantState(
  participantId: string,
  updates: Partial<{
    status: EventStatus;
    isOfficer: boolean;
    appNotes: string;
    carId: string | null;
    checkInState: Participant["checkInState"];
  }>,
) {
  const payload: Partial<typeof participantState.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (typeof updates.status !== "undefined") payload.status = updates.status;
  if (typeof updates.isOfficer !== "undefined") payload.isOfficer = updates.isOfficer;
  if (typeof updates.appNotes !== "undefined") payload.appNotes = updates.appNotes;
  if (typeof updates.carId !== "undefined") payload.carId = updates.carId;
  if (typeof updates.checkInState !== "undefined") {
    payload.checkInState = updates.checkInState;
  }

  await db
    .update(participantState)
    .set(payload)
    .where(eq(participantState.participantId, participantId));

  return getEventData();
}

export async function assignRiderToCar(riderId: string, carId: string | null) {
  await db
    .update(participantState)
    .set({ carId, updatedAt: new Date() })
    .where(eq(participantState.participantId, riderId));

  return getEventData();
}

export async function autoAssignCars(prioritizeOfficers: boolean) {
  const participants = await syncFromSheet();
  const result = optimizeCarpoolAssignments(participants, prioritizeOfficers);

  const riderIds = participants.filter((p) => !p.driver).map((p) => p.id);

  if (riderIds.length > 0) {
    await db
      .update(participantState)
      .set({ carId: null, updatedAt: new Date() })
      .where(inArray(participantState.participantId, riderIds));
  }

  const entries = [...result.assignments.entries()];
  for (const [riderId, assignedCarId] of entries) {
    await db
      .update(participantState)
      .set({ carId: assignedCarId, updatedAt: new Date() })
      .where(and(eq(participantState.participantId, riderId)));
  }

  const generatedCars = result.cars.map((car) => ({
    id: car.id,
    driverId: car.driverId,
    createdAt: new Date(),
  }));

  await db.delete(cars);
  if (generatedCars.length > 0) {
    await db.insert(cars).values(generatedCars);
  }

  return getEventData();
}
