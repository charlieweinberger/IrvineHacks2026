import type { Insight, Participant } from "@/types";

export function generateMockInsights(participants: Participant[]): Insight[] {
  const awaiting = participants.filter((p) => p.status === "awaiting");
  const ambiguous = participants.filter((p) => p.status === "ambiguous");
  const noCar = participants.filter(
    (p) => !p.driver && p.status !== "cancelled" && !p.carId,
  );

  const insights: Insight[] = [];

  if (awaiting.length > 0) {
    insights.push({
      id: "awaiting-followup",
      title: "Follow up on pending responses",
      description: `${awaiting.length} participants still have no text status update.`,
      severity: "medium",
      suggestion: "Bulk mark as text sent after outreach.",
      relatedParticipantIds: awaiting.slice(0, 8).map((p) => p.id),
    });
  }

  if (ambiguous.length > 0) {
    insights.push({
      id: "ambiguous-review",
      title: "Ambiguous responses need review",
      description: `${ambiguous.length} replies look ambiguous and should be manually verified.`,
      severity: "high",
      suggestion: "Flag these users for officer callback.",
      relatedParticipantIds: ambiguous.slice(0, 8).map((p) => p.id),
    });
  }

  if (noCar.length > 0) {
    insights.push({
      id: "unassigned-riders",
      title: "Unassigned riders detected",
      description: `${noCar.length} riders are still unassigned to a car.`,
      severity: "low",
      suggestion: "Run Auto Assign Carpools or drag riders manually.",
      relatedParticipantIds: noCar.slice(0, 8).map((p) => p.id),
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "all-clear",
      title: "Operations look healthy",
      description:
        "No major operational risks detected. Keep monitoring confirmations and check-ins.",
      severity: "low",
    });
  }

  return insights;
}
