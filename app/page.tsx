"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Header from "@/components/layout/Header";
import DashboardPage from "@/components/dashboard/DashboardPage";
import OrgChartPage from "@/components/org-chart/OrgChartPage";
import TasksPage from "@/components/tasks/TasksPage";
import StandupsPage from "@/components/standups/StandupsPage";
import BoardroomPage from "@/components/boardroom/BoardroomPage";
import FinancePage from "@/components/finance/FinancePage";
import InvestmentsPage from "@/components/investments/InvestmentsPage";
import AgentConfigPage from "@/components/agent-config/AgentConfigPage";
import ReportsPage from "@/components/reports/ReportsPage";

export type Section = "dashboard" | "org-chart" | "tasks" | "standups" | "boardroom" | "finance" | "investments" | "agent-config" | "reports";

export default function Home() {
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (section) {
      case "dashboard": return <DashboardPage />;
      case "org-chart": return <OrgChartPage />;
      case "tasks": return <TasksPage />;
      case "standups": return <StandupsPage />;
      case "boardroom": return <BoardroomPage />;
      case "finance": return <FinancePage />;
      case "investments": return <InvestmentsPage />;
      case "agent-config": return <AgentConfigPage />;
      case "reports": return <ReportsPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar
          section={section}
          onNavigate={setSection}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 main-content">
          {renderSection()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-bottom-nav hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(0,0,0,0.95)] border-t border-[rgba(255,255,255,0.05)] backdrop-blur-xl">
        <MobileNav section={section} onNavigate={setSection} />
      </div>
    </div>
  );
}
