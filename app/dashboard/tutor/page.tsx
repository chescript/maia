import { Metadata } from "next";
import { AiTutorPage } from "@/components/tutor/AiTutorPage";

export const metadata: Metadata = {
  title: "AI Tutor - Maia CRMA Prep",
  description: "Chat with Maia, your AI tutor for personalized CRMA exam preparation",
};

export default function TutorPage() {
  return <AiTutorPage />;
}