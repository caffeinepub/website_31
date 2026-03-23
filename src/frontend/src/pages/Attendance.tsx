import { useState } from "react";
import AttendanceList from "../components/AttendanceList";
import EdgeStorageBanner from "../components/EdgeStorageBanner";
import MonthlyAttendanceSummary from "../components/MonthlyAttendanceSummary";
import { monthlyAttendanceData } from "../utils/attendanceData";
import { dummyChildren } from "../utils/dummyData";

type AttendanceState = Record<string, "present" | "absent">;

function getInitialAttendance(): AttendanceState {
  const state: AttendanceState = {};
  for (const child of dummyChildren) {
    state[child.id] = ["C001", "C004", "C007"].includes(child.id)
      ? "present"
      : "absent";
  }
  return state;
}

export default function Attendance() {
  const [attendance, setAttendance] =
    useState<AttendanceState>(getInitialAttendance);

  const handleToggle = (childId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [childId]: prev[childId] === "present" ? "absent" : "present",
    }));
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading font-bold text-lg">
          Attendance Management
        </h2>
        <p className="text-xs text-muted-foreground">{today}</p>
      </div>

      <EdgeStorageBanner />

      <AttendanceList
        records={dummyChildren}
        attendance={attendance}
        onToggle={handleToggle}
      />

      <MonthlyAttendanceSummary
        records={dummyChildren}
        attendanceData={monthlyAttendanceData}
      />

      <p className="text-xs text-center text-muted-foreground pb-2">
        Attendance data stored locally · Syncs when connectivity available
      </p>
    </div>
  );
}
