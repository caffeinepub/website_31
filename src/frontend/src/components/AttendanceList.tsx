import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import type { ChildRecord } from "../utils/dummyData";
import AttendanceToggle from "./AttendanceToggle";

interface AttendanceListProps {
  records: ChildRecord[];
  attendance: Record<string, "present" | "absent">;
  onToggle: (childId: string) => void;
}

export default function AttendanceList({
  records,
  attendance,
  onToggle,
}: AttendanceListProps) {
  const presentCount = Object.values(attendance).filter(
    (s) => s === "present",
  ).length;

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm">
            Today's Attendance
          </h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {presentCount}/{records.length} Present
          </span>
        </div>
        <div className="space-y-2">
          {records.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User size={14} className="text-secondary-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{child.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {child.ageMonths}m · {child.gender}
                  </p>
                </div>
              </div>
              <AttendanceToggle
                childId={child.id}
                status={attendance[child.id] || "absent"}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
