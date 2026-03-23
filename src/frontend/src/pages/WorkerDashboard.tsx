import AttendanceAnalyticsChart from "../components/AttendanceAnalyticsChart";
import DashboardSummaryCards from "../components/DashboardSummaryCards";
import ExportReportButton from "../components/ExportReportButton";
import RiskSummaryTable from "../components/RiskSummaryTable";
import { getDashboardStats } from "../utils/dashboardData";
import { dummyChildren } from "../utils/dummyData";

export default function WorkerDashboard() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-lg">Worker Dashboard</h2>

      <DashboardSummaryCards
        total={stats.total}
        yellowRisk={stats.yellowRisk}
        redRisk={stats.redRisk}
        normalCount={stats.normalCount}
        todayAttendanceRate={stats.todayAttendanceRate}
      />

      <AttendanceAnalyticsChart data={stats.monthlyTrend} />

      <RiskSummaryTable records={dummyChildren} />

      <ExportReportButton />

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
