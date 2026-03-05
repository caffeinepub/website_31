import { Card, CardContent } from "@/components/ui/card";
import { Activity, Calendar, User } from "lucide-react";
import type { MonthlyAttendance } from "../utils/attendanceData";
import type { ChildRecord } from "../utils/dummyData";
import NutritionalStatusBadge from "./NutritionalStatusBadge";

interface ChildSummaryCardProps {
  child: ChildRecord;
  attendance: MonthlyAttendance | undefined;
}

export default function ChildSummaryCard({
  child,
  attendance,
}: ChildSummaryCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <User size={28} className="text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">{child.name}</h3>
            <p className="text-sm text-muted-foreground">
              {child.ageMonths} months · {child.gender} · {child.id}
            </p>
            <div className="mt-1">
              <NutritionalStatusBadge status={child.status} size="sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-lg p-3 text-center">
            <Activity size={16} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">BMI</p>
            <p className="font-bold text-base">{child.bmi}</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-base font-bold text-center mb-0.5">⚖</div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="font-bold text-base">{child.weight} kg</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <Calendar size={16} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p
              className={`font-bold text-base ${attendance && attendance.percentage < 75 ? "text-status-yellow" : "text-status-green"}`}
            >
              {attendance ? `${attendance.percentage}%` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Parent:{" "}
            <span className="font-medium text-foreground">
              {child.parentName}
            </span>
            {" · "}
            <span className="font-medium text-foreground">
              {child.parentPhone}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
