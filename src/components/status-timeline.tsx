"use client";

import type { EventStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STEPS: { value: EventStatus; label: string }[] = [
  { value: "awaiting", label: "Signed Up" },
  { value: "text_sent", label: "Text Sent" },
  { value: "ambiguous", label: "Ambiguous" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "present", label: "Present" },
];

function statusOrder(status: EventStatus) {
  const idx = STATUS_STEPS.findIndex((s) => s.value === status);
  return idx < 0 ? 0 : idx;
}

export function StatusTimeline({
  status,
  onChange,
}: {
  status: EventStatus;
  onChange: (next: EventStatus) => void;
}) {
  const activeIdx = statusOrder(status);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {STATUS_STEPS.map((step, idx) => {
          const isActive = idx <= activeIdx;
          const isExact = step.value === status;

          return (
            <button
              key={step.value}
              type="button"
              onClick={() => onChange(step.value)}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                isActive ? "bg-zinc-900" : "bg-zinc-200",
                isExact && "ring-2 ring-zinc-500 ring-offset-1",
              )}
              title={step.label}
              aria-label={step.label}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1 text-xs text-zinc-500">
        {STATUS_STEPS.map((step) => (
          <button
            key={step.value}
            type="button"
            className={cn(
              "rounded bg-zinc-100 px-2 py-1",
              status === step.value && "bg-zinc-900 text-white",
            )}
            onClick={() => onChange(step.value)}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}
