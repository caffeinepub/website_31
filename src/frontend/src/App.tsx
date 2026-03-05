import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import Attendance from "./pages/Attendance";
import BmiCalculatorPage from "./pages/BmiCalculatorPage";
import GrowthMonitoring from "./pages/GrowthMonitoring";
import ParentView from "./pages/ParentView";
import PregnantWomenPage from "./pages/PregnantWomenPage";
import WorkerDashboard from "./pages/WorkerDashboard";

export type AppTab =
  | "growth"
  | "attendance"
  | "parent"
  | "dashboard"
  | "pregnant-women"
  | "bmi-calculator";

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

  const renderPage = () => {
    switch (activeTab) {
      case "growth":
        return <GrowthMonitoring />;
      case "attendance":
        return <Attendance />;
      case "parent":
        return <ParentView />;
      case "dashboard":
        return <WorkerDashboard />;
      case "pregnant-women":
        return <PregnantWomenPage />;
      case "bmi-calculator":
        return <BmiCalculatorPage />;
      default:
        return <WorkerDashboard />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderPage()}
      </Layout>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
