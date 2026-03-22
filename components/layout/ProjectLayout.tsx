"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectContextProvider, useProjectContext } from "@/lib/context/ProjectContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

function ProjectLayoutInner({ children }: { children: React.ReactNode }) {
  const { project } = useProjectContext();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (project === null) {
      // After initial load, if project is still null, redirect
      const timer = setTimeout(() => {
        router.push("/");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [project, router]);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0" style={{ marginLeft: 240 }}>
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProjectContextProvider projectId={id}>
      <ProjectLayoutInner>{children}</ProjectLayoutInner>
    </ProjectContextProvider>
  );
}
