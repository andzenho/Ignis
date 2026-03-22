"use client";

// FunnelLayout is a passthrough — ProjectLayout (via [id]/layout.tsx) already
// renders the sidebar and header. Zone 2 in Sidebar handles funnel-level nav
// based on the current URL params.

interface FunnelLayoutProps {
  project?: unknown;
  launch?: unknown;
  funnel?: unknown;
  activeSection?: string;
  children: React.ReactNode;
}

export default function FunnelLayout({ children }: FunnelLayoutProps) {
  return <>{children}</>;
}
