import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendanceAnalyticsChartProps {
  data: { month: string; attendance: number }[];
}

export default function AttendanceAnalyticsChart({
  data,
}: AttendanceAnalyticsChartProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-sm mb-3">
          Monthly Attendance Trend
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Attendance"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <ReferenceLine
              y={75}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: "75%",
                position: "right",
                fontSize: 10,
                fill: "#f59e0b",
              }}
            />
            <Bar dataKey="attendance" radius={[4, 4, 0, 0]} fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dashed line = 75% minimum threshold
        </p>
      </CardContent>
    </Card>
  );
}
