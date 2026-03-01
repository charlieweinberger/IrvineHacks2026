import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

export function DashboardSummary({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Signed Up", value: stats.totalSignedUp },
    { label: "Confirmed", value: stats.confirmed },
    { label: "Cancelled", value: stats.cancelled },
    { label: "Awaiting Response", value: stats.awaitingResponse },
    { label: "Text Sent", value: stats.textSent },
    { label: "Ambiguous", value: stats.ambiguous },
    { label: "Present", value: stats.present },
    { label: "Officers Attending", value: stats.officersAttending },
    { label: "Total Drivers", value: stats.totalDrivers },
    { label: "Self-Drivers", value: stats.selfDrivers },
    { label: "Cars Created", value: stats.carsCreated },
    { label: "Total Riders", value: stats.totalRiders },
    { label: "Assigned Riders", value: stats.assignedRiders },
    { label: "Unassigned Riders", value: stats.unassignedRiders },
    { label: "Total Seats Available", value: stats.totalSeatsAvailable },
    { label: "Total Seats Used", value: stats.totalSeatsUsed },
    { label: "Carpool Utilization", value: `${stats.carpoolUtilization}%` },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="bg-linear-to-b from-white to-zinc-50"
        >
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-wide text-zinc-500">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
