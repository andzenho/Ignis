"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Launch } from "@/lib/types";
import { getLaunch } from "@/lib/storage";

interface LaunchContextValue {
  launch: Launch | null;
  setLaunch: (launch: Launch | null) => void;
  refreshLaunch: () => void;
}

const LaunchContext = createContext<LaunchContextValue | null>(null);

export function LaunchContextProvider({
  children,
  projectId,
  launchId,
}: {
  children: ReactNode;
  projectId: string;
  launchId: string;
}) {
  const [launch, setLaunch] = useState<Launch | null>(null);

  const refreshLaunch = () => {
    const l = getLaunch(projectId, launchId);
    setLaunch(l ?? null);
  };

  useEffect(() => {
    refreshLaunch();
  }, [projectId, launchId]);

  return (
    <LaunchContext.Provider value={{ launch, setLaunch, refreshLaunch }}>
      {children}
    </LaunchContext.Provider>
  );
}

export function useLaunchContext() {
  const ctx = useContext(LaunchContext);
  if (!ctx) throw new Error("useLaunchContext must be used within LaunchContextProvider");
  return ctx;
}
