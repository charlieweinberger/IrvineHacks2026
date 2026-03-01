import { Star } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function PaidMemberIcon({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <Tooltip content="Paid Member">
      <Star className={cn(
        "fill-amber-400 text-amber-500",
        size === "small" ? "h-3 w-3" : "h-4 w-4"
      )} />
    </Tooltip>
  );
}
