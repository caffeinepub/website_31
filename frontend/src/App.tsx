import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import GrowthMonitoring from './pages/GrowthMonitoring';
import Attendance from './pages/Attendance';
import ParentView from './pages/ParentView';
import WorkerDashboard from './pages/WorkerDashboard';
import PregnantWomenPage from './pages/PregnantWomenPage';

export type AppTab = 'growth' | 'attendance' | 'parent' | 'dashboard' | 'pregnant-women';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'growth': return <GrowthMonitoring />;
      case 'attendance': return <Attendance />;
      case 'parent': return <ParentView />;
      case 'dashboard': return <WorkerDashboard />;
      case 'pregnant-women': return <PregnantWomenPage />;
      default: return <WorkerDashboard />;
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
