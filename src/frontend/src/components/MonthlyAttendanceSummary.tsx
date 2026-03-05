import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import type { MonthlyAttendance } from "../utils/attendanceData";
import type { ChildRecord } from "../utils/dummyData";

interface MonthlyAttendanceSummaryProps {
  records: ChildRecord[];
  attendanceData: MonthlyAttendance[];
}

export default function MonthlyAttendanceSummary({
  records,
  attendanceData,
}: MonthlyAttendanceSummaryProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-sm mb-3">
          Monthly Attendance Summary – Jan 2026
        </h3>
        <div className="space-y-3">
          {records.map((child) => {
            const att = attendanceData.find((a) => a.childId === child.id);
            if (!att) return null;
            const isLow = att.percentage < 75;
            return (
              <div
                key={child.id}
                className={`rounded-lg p-3 ${isLow ? "bg-status-yellow-bg border border-status-yellow/30" : "bg-muted"}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isLow && (
                      <AlertTriangle
                        size={14}
                        className="text-status-yellow shrink-0"
                      />
                    )}
                    <span className="text-sm font-medium">{child.name}</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${isLow ? "text-status-yellow" : "text-status-green"}`}
                  >
                    {att.percentage}%
                  </span>
                </div>
                <Progress value={att.percentage} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">
                  {att.presentDays}/{att.totalDays} days ·{" "}
                  {isLow ? "⚠ Below 75% threshold" : "Regular attendance"}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
