import { Metadata } from "next";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ModulesProgress } from "@/components/dashboard/ModulesProgress";
import { DetailedInsights } from "@/components/dashboard/DetailedInsights";
import { ChatWidget } from "@/components/dashboard/ChatWidget";
import { ExamTestSection } from "@/components/dashboard/ExamTestSection";
import { ExamReadinessOverview } from "@/components/dashboard/ExamReadinessOverview";

export const metadata: Metadata = {
  title: "Dashboard - Maia CRMA Prep",
  description: "Your personalized CRMA exam preparation dashboard",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <TopBar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 space-y-6 ml-64">
          {/* CRMA Exam Readiness Overview */}
          <ExamReadinessOverview />

          {/* Modules/Units Progress Section */}
          <ModulesProgress />

          {/* Interactive Exam & Test Section */}
          <ExamTestSection />

          {/* Detailed Insights Section */}
          <DetailedInsights />
        </main>
      </div>

      {/* Persistent Chat Widget */}
      <ChatWidget />
    </div>
  );
}
