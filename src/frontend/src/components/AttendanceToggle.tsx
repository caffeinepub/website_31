import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface AttendanceToggleProps {
  childId: string;
  status: "present" | "absent";
  onToggle: (childId: string) => void;
}

export default function AttendanceToggle({
  childId,
  status,
  onToggle,
}: AttendanceToggleProps) {
  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        variant={status === "present" ? "default" : "outline"}
        className={`h-9 px-3 text-xs font-semibold transition-all ${
          status === "present"
            ? "bg-status-green text-white border-status-green hover:bg-status-green/90"
            : "text-muted-foreground hover:text-status-green hover:border-status-green"
        }`}
        onClick={() => status !== "present" && onToggle(childId)}
      >
        <Check size={14} className="mr-1" />
        Present
      </Button>
      <Button
        size="sm"
        variant={status === "absent" ? "default" : "outline"}
        className={`h-9 px-3 text-xs font-semibold transition-all ${
          status === "absent"
            ? "bg-status-red text-white border-status-red hover:bg-status-red/90"
            : "text-muted-foreground hover:text-status-red hover:border-status-red"
        }`}
        onClick={() => status !== "absent" && onToggle(childId)}
      >
        <X size={14} className="mr-1" />
        Absent
      </Button>
    </div>
  );
}
