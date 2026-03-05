export interface AttendanceRecord {
  childId: string;
  date: string;
  status: "present" | "absent";
}

export interface MonthlyAttendance {
  childId: string;
  month: string;
  presentDays: number;
  totalDays: number;
  percentage: number;
}

// Simulated attendance for January 2026 (22 working days)
export const monthlyAttendanceData: MonthlyAttendance[] = [
  {
    childId: "C001",
    month: "Jan 2026",
    presentDays: 20,
    totalDays: 22,
    percentage: 91,
  },
  {
    childId: "C002",
    month: "Jan 2026",
    presentDays: 15,
    totalDays: 22,
    percentage: 68,
  },
  {
    childId: "C003",
    month: "Jan 2026",
    presentDays: 12,
    totalDays: 22,
    percentage: 55,
  },
  {
    childId: "C004",
    month: "Jan 2026",
    presentDays: 21,
    totalDays: 22,
    percentage: 95,
  },
  {
    childId: "C005",
    month: "Jan 2026",
    presentDays: 16,
    totalDays: 22,
    percentage: 73,
  },
  {
    childId: "C006",
    month: "Jan 2026",
    presentDays: 10,
    totalDays: 22,
    percentage: 45,
  },
  {
    childId: "C007",
    month: "Jan 2026",
    presentDays: 19,
    totalDays: 22,
    percentage: 86,
  },
];

// Monthly trend data for analytics chart
export const monthlyTrendData = [
  { month: "Sep", attendance: 82 },
  { month: "Oct", attendance: 78 },
  { month: "Nov", attendance: 85 },
  { month: "Dec", attendance: 71 },
  { month: "Jan", attendance: 73 },
  { month: "Feb", attendance: 80 },
];

export function getAttendanceForChild(
  childId: string,
): MonthlyAttendance | undefined {
  return monthlyAttendanceData.find((a) => a.childId === childId);
}
