import { BarChart2 } from "lucide-react";
import AttendanceAnalyticsChart from "../components/AttendanceAnalyticsChart";
import DashboardSummaryCards from "../components/DashboardSummaryCards";
import ExportReportButton from "../components/ExportReportButton";
import RiskSummaryTable from "../components/RiskSummaryTable";
import { getDashboardStats } from "../utils/dashboardData";
import { dummyChildren } from "../utils/dummyData";

export default function WorkerDashboard() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BarChart2 size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">Worker Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            AWC-042 · Feb 2026 Overview
          </p>
        </div>
        <div className="ml-auto">
          <img
            src="/assets/generated/dashboard-icon.dim_128x128.png"
            alt=""
            className="w-8 h-8 rounded object-cover"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummaryCards
        total={stats.total}
        yellowRisk={stats.yellowRisk}
        redRisk={stats.redRisk}
        normalCount={stats.normalCount}
        todayAttendanceRate={stats.todayAttendanceRate}
      />

      {/* Attendance Analytics */}
      <AttendanceAnalyticsChart data={stats.monthlyTrend} />

      {/* Risk Summary */}
      <RiskSummaryTable records={dummyChildren} />

      {/* Export */}
      <ExportReportButton />

      {/* Footer */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground">
          Smart Anganwadi © {new Date().getFullYear()} · Built with{" "}
          <span className="text-status-red">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "smart-anganwadi")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
