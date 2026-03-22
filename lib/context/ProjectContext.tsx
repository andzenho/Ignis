"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project } from "@/lib/types";
import { getProject } from "@/lib/storage";

interface ProjectContextValue {
  project: Project | null;
  setProject: (project: Project | null) => void;
  refreshProject: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectContextProvider({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId: string;
}) {
  const [project, setProject] = useState<Project | null>(null);

  const refreshProject = () => {
    const p = getProject(projectId);
    setProject(p ?? null);
  };

  useEffect(() => {
    refreshProject();
  }, [projectId]);

  return (
    <ProjectContext.Provider value={{ project, setProject, refreshProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used within ProjectContextProvider");
  return ctx;
}
