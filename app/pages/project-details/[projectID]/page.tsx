'use client';
import { use } from 'react';
import ProjectDetailsPage from "@/app/components/ProjectDetailsPage";

interface ProjectPageProps {
  params: Promise<{ projectID: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectID } = use(params);
  
  return (
    <div className="min-h-screen bg-background">
      <ProjectDetailsPage projectID={projectID} />
    </div>
  );
}