import {
  Activity,
  BarChart2,
  Calculator,
  Heart,
  UserCheck,
  Users,
} from "lucide-react";
import type { AppTab } from "../App";

interface BottomNavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const navItems = [
  { tab: "dashboard" as AppTab, label: "Dashboard", Icon: BarChart2 },
  { tab: "growth" as AppTab, label: "Growth", Icon: Activity },
  { tab: "attendance" as AppTab, label: "Attendance", Icon: UserCheck },
  { tab: "parent" as AppTab, label: "Parent", Icon: Users },
  { tab: "pregnant-women" as AppTab, label: "Pregnant", Icon: Heart },
  { tab: "bmi-calculator" as AppTab, label: "BMI", Icon: Calculator },
];

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-stretch">
        {navItems.map(({ tab, label, Icon }) => (
          <button
            type="button"
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px] ${
              activeTab === tab
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={activeTab === tab ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
