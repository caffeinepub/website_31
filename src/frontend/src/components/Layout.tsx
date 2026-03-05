import {
  Activity,
  BarChart2,
  Calculator,
  Heart,
  UserCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AppTab } from "../App";
import BottomNavigation from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const navItems = [
  { tab: "dashboard" as AppTab, label: "Dashboard", Icon: BarChart2 },
  { tab: "growth" as AppTab, label: "Growth", Icon: Activity },
  { tab: "attendance" as AppTab, label: "Attendance", Icon: UserCheck },
  { tab: "parent" as AppTab, label: "Parent View", Icon: Users },
  { tab: "pregnant-women" as AppTab, label: "Pregnant Women", Icon: Heart },
  {
    tab: "bmi-calculator" as AppTab,
    label: "BMI Calculator",
    Icon: Calculator,
  },
];

export default function Layout({
  children,
  activeTab,
  onTabChange,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary shadow-card">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <img
            src="/assets/generated/anganwadi-hero.dim_800x400.png"
            alt="Smart Anganwadi"
            className="h-9 w-auto rounded object-cover"
            style={{ maxWidth: "48px" }}
          />
          <div>
            <h1 className="text-primary-foreground font-heading font-bold text-base leading-tight">
              Smart Anganwadi
            </h1>
            <p className="text-primary-foreground/80 text-xs leading-tight">
              ICDS Digital Platform
            </p>
          </div>
          <div className="ml-auto">
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              AWC-042
            </span>
          </div>
        </div>
      </header>

      {/* Desktop Tab Navigation */}
      <nav className="hidden md:flex bg-card border-b border-border shadow-xs sticky top-[60px] z-30">
        <div className="container mx-auto px-4 flex gap-1 py-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === item.tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.Icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-6">
        <div className="container mx-auto px-4 py-4 max-w-2xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="hidden md:block bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        <p>
          Smart Anganwadi © {new Date().getFullYear()} · ICDS Digital Platform ·
          Built with <span className="text-status-red">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "smart-anganwadi")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
