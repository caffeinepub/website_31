import { useState } from 'react';
import AttendanceList from '../components/AttendanceList';
import MonthlyAttendanceSummary from '../components/MonthlyAttendanceSummary';
import EdgeStorageBanner from '../components/EdgeStorageBanner';
import { dummyChildren } from '../utils/dummyData';
import { monthlyAttendanceData } from '../utils/attendanceData';
import { UserCheck } from 'lucide-react';

type AttendanceState = Record<string, 'present' | 'absent'>;

function getInitialAttendance(): AttendanceState {
  const state: AttendanceState = {};
  dummyChildren.forEach(child => {
    // Simulate some children already marked present
    state[child.id] = ['C001', 'C004', 'C007'].includes(child.id) ? 'present' : 'absent';
  });
  return state;
}

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceState>(getInitialAttendance);

  const handleToggle = (childId: string) => {
    setAttendance(prev => ({
      ...prev,
      [childId]: prev[childId] === 'present' ? 'absent' : 'present',
    }));
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <UserCheck size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">Attendance Management</h2>
          <p className="text-xs text-muted-foreground">{today}</p>
        </div>
      </div>

      {/* Edge Storage Banner */}
      <EdgeStorageBanner />

      {/* Today's Attendance */}
      <AttendanceList
        children={dummyChildren}
        attendance={attendance}
        onToggle={handleToggle}
      />

      {/* Monthly Summary */}
      <MonthlyAttendanceSummary
        children={dummyChildren}
        attendanceData={monthlyAttendanceData}
      />

      {/* Footer note */}
      <p className="text-xs text-center text-muted-foreground pb-2">
        Attendance data stored locally · Syncs when connectivity available
      </p>
    </div>
  );
}
