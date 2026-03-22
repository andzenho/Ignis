"use client";

import { useParams } from "next/navigation";
import { LaunchContextProvider } from "@/lib/context/LaunchContext";

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params.id as string;
  const lid = params.lid as string;

  return (
    <LaunchContextProvider projectId={id} launchId={lid}>
      {children}
    </LaunchContextProvider>
  );
}
