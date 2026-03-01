"use client";

import type { EventStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusTimeline({
  status,
  onChange,
}: {
  status: EventStatus;
  onChange: (next: EventStatus) => void;
}) {
  // Response options: mutually exclusive
  const responseOptions = [
    { value: "confirmed" as const, label: "Confirmed" },
    { value: "ambiguous" as const, label: "Ambiguous" },
    { value: "cancelled" as const, label: "Cancelled" },
  ];

  return (
    <div className="space-y-2">
      {/* Main flow: Progression → Response → Present */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Signed Up / Text Sent toggle */}
        <div className="flex gap-1 flex-1">
          <button
            type="button"
            onClick={() => onChange("awaiting")}
            className={cn(
              "flex-1 rounded px-2 py-2 font-semibold transition-colors",
              status === "awaiting"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300",
            )}
          >
            Signed Up
          </button>
          <button
            type="button"
            onClick={() => onChange("text_sent")}
            className={cn(
              "flex-1 rounded px-2 py-2 font-semibold transition-colors",
              status === "text_sent"
                ? "bg-purple-600 text-white ring-1 ring-purple-400"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300",
            )}
          >
            Text Sent
          </button>
        </div>

        {/* Arrow separator */}
        <div className="text-zinc-400">→</div>

        {/* Response options: Ambiguous / Confirmed / Cancelled */}
        <div className="flex gap-1 flex-1">
          {responseOptions.map((option) => {
            let bgColor = "bg-zinc-200";
            let textColor = "text-zinc-700";
            let ringColor = "";

            if (status === option.value) {
              if (option.value === "confirmed") {
                bgColor = "bg-green-600";
                textColor = "text-white";
                ringColor = "ring-1 ring-green-400";
              } else if (option.value === "ambiguous") {
                bgColor = "bg-yellow-500";
                textColor = "text-white";
                ringColor = "ring-1 ring-yellow-400";
              } else if (option.value === "cancelled") {
                bgColor = "bg-red-600";
                textColor = "text-white";
                ringColor = "ring-1 ring-red-400";
              }
            }

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={cn(
                  "flex-1 rounded px-2 py-2 font-semibold transition-colors",
                  status === option.value
                    ? `${bgColor} ${textColor} ${ringColor}`
                    : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Arrow + Present */}
        <div className="text-zinc-400">→</div>
        <button
          type="button"
          onClick={() => status !== "cancelled" && onChange("present")}
          disabled={status === "cancelled"}
          className={cn(
            "rounded px-2 py-2 font-semibold transition-colors whitespace-nowrap",
            status === "cancelled"
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : status === "present"
                ? "bg-blue-600 text-white ring-1 ring-blue-400 hover:bg-blue-700"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300",
          )}
        >
          Present
        </button>
      </div>
    </div>
  );
}
