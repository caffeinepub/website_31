import { monthlyAttendanceData, monthlyTrendData } from "./attendanceData";
import { dummyChildren } from "./dummyData";

export function getDashboardStats() {
  const total = dummyChildren.length;
  const yellowRisk = dummyChildren.filter(
    (c) => c.status === "moderate",
  ).length;
  const redRisk = dummyChildren.filter((c) => c.status === "severe").length;
  const normalCount = dummyChildren.filter((c) => c.status === "normal").length;

  const avgAttendance = Math.round(
    monthlyAttendanceData.reduce((sum, a) => sum + a.percentage, 0) /
      monthlyAttendanceData.length,
  );

  return {
    total,
    yellowRisk,
    redRisk,
    normalCount,
    todayAttendanceRate: avgAttendance,
    monthlyTrend: monthlyTrendData,
  };
}
