import { Metadata } from "next";
import { ModulesProgress } from "@/components/dashboard/ModulesProgress";
import { DetailedInsights } from "@/components/dashboard/DetailedInsights";
import { ExamTestSection } from "@/components/dashboard/ExamTestSection";
import { ExamReadinessOverview } from "@/components/dashboard/ExamReadinessOverview";

export const metadata: Metadata = {
  title: "Dashboard - Maia CRMA Prep",
  description: "Your personalized CRMA exam preparation dashboard",
};

export default function DashboardPage() {
  return (
    <>
      {/* CRMA Exam Readiness Overview */}
      <ExamReadinessOverview />

      {/* Modules/Units Progress Section */}
      <ModulesProgress />

      {/* Interactive Exam & Test Section */}
      <ExamTestSection />

      {/* Detailed Insights Section */}
      <DetailedInsights />
    </>
  );
}
