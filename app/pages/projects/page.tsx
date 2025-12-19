import React from "react";
import ProjectsPage from "@/app/components/ProjectsPage";

export const metadata = {
  title: "Projects | Samson Olusola",
  description: "Selected work and case studies by Samson Olusola.",
};

export default function page() {
  return (
    <div className="min-h-screen bg-background">
      <ProjectsPage />
    </div>
  );
}
