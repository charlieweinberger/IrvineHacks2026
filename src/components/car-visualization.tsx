"use client";

import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Car, Participant } from "@/types";

interface SeatProps {
  seatId: string;
  seatLabel: string;
  occupant: Participant | undefined;
  isDriver: boolean;
}

function Seat({ seatId, seatLabel, occupant, isDriver }: SeatProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: seatId,
  });

  const displayName = occupant
    ? occupant.name.split(" ").map((n) => n[0]).join("")
    : "";

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 font-semibold transition-all",
        isDriver ? "border-amber-400 bg-amber-50" : "border-zinc-300 bg-white",
        isOver && "border-zinc-900 bg-zinc-100 shadow-md ring-2 ring-zinc-500 ring-offset-1",
        occupant && "border-emerald-500 bg-emerald-50",
      )}
      title={occupant ? occupant.name : seatLabel}
    >
      {occupant ? (
        <>
          <span className="text-xs font-bold text-zinc-900">{displayName}</span>
          <span className="text-[10px] text-zinc-600 text-center line-clamp-2">{occupant.name}</span>
        </>
      ) : (
        <span className="text-xs text-zinc-500 text-center">{seatLabel}</span>
      )}
    </button>
  );
}

export function CarVisualization({
  car,
  participantsById,
}: {
  car: Car;
  participantsById: Map<string, Participant>;
}) {
  const driverParticipant = participantsById.get(car.driverId);
  const occupiedCount = car.riderIds.length;
  const seatCount = car.seatsTotal;

  // Map seat indices to rider IDs
  const seatMap = new Map<number, string>();
  car.riderIds.forEach((riderId, idx) => {
    seatMap.set(idx, riderId);
  });

  const rearSeatCount = seatCount - 1; // Total rear seats (remaining after driver)

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900">{car.driverName}</h3>
          <p className="text-xs text-zinc-500">
            {occupiedCount} / {seatCount} seats
          </p>
        </div>
        <Badge variant={occupiedCount >= seatCount ? "warning" : "success"}>
          {occupiedCount}/{seatCount}
        </Badge>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-sm">
          {/* Car container */}
          <div className="rounded-3xl border-4 border-zinc-800 bg-zinc-100 p-4" style={{ aspectRatio: "9 / 16" }}>
            {/* Front of car */}
            <div className="mb-3 h-2 rounded-full bg-zinc-700" />

            {/* Front seats */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <Seat
                seatId={`seat:${car.id}:driver`}
                seatLabel="Driver"
                occupant={driverParticipant}
                isDriver={true}
              />
              <Seat
                seatId={`seat:${car.id}:0`}
                seatLabel="Passenger"
                occupant={seatMap.has(0) ? participantsById.get(seatMap.get(0)!) : undefined}
                isDriver={false}
              />
            </div>

            {/* Rear seats - layout depends on count */}
            <div className={cn(
              "grid gap-3",
              rearSeatCount === 1 ? "grid-cols-1" :
              rearSeatCount === 2 ? "grid-cols-2" :
              "grid-cols-3"
            )}>
              {Array.from({ length: rearSeatCount }).map((_, idx) => {
                const seatIndex = idx + 1;
                const riderId = seatMap.get(seatIndex);
                const occupant = riderId ? participantsById.get(riderId) : undefined;

                return (
                  <Seat
                    key={seatIndex}
                    seatId={`seat:${car.id}:${seatIndex}`}
                    seatLabel={
                      rearSeatCount === 1 ? "Rear" :
                      rearSeatCount === 2 ? (idx === 0 ? "Rear L" : "Rear R") :
                      (idx === 0 ? "Rear L" : idx === 1 ? "Rear C" : "Rear R")
                    }
                    occupant={occupant}
                    isDriver={false}
                  />
                );
              })}
            </div>

            {/* Back of car */}
            <div className="mt-3 h-2 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
