import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, UserCheck, Users } from "lucide-react";

interface DashboardSummaryCardsProps {
  total: number;
  yellowRisk: number;
  redRisk: number;
  normalCount: number;
  todayAttendanceRate: number;
}

export default function DashboardSummaryCards({
  total,
  yellowRisk,
  redRisk,
  normalCount,
  todayAttendanceRate,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      label: "Total Enrolled",
      value: total,
      icon: Users,
      color: "text-primary",
      bg: "bg-secondary/60",
    },
    {
      label: "Normal",
      value: normalCount,
      icon: UserCheck,
      color: "text-status-green",
      bg: "bg-status-green-bg",
    },
    {
      label: "Moderate Risk",
      value: yellowRisk,
      icon: AlertTriangle,
      color: "text-status-yellow",
      bg: "bg-status-yellow-bg",
    },
    {
      label: "Severe Risk",
      value: redRisk,
      icon: AlertCircle,
      color: "text-status-red",
      bg: "bg-status-red-bg",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-card">
            <CardContent className="p-4">
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}
              >
                <Icon size={18} className={color} />
              </div>
              <p className={`text-2xl font-bold font-heading ${color}`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <UserCheck size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading text-primary">
              {todayAttendanceRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              Average Monthly Attendance Rate
            </p>
          </div>
          <div className="ml-auto">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: `conic-gradient(oklch(0.60 0.16 145) ${todayAttendanceRate * 3.6}deg, oklch(0.94 0.06 145) 0deg)`,
                color: "oklch(0.60 0.16 145)",
              }}
            >
              {todayAttendanceRate}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
