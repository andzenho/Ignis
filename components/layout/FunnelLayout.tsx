"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Project, Launch, Funnel } from "@/lib/types";
import {
  LayoutDashboard,
  Settings,
  Activity,
  BarChart3,
  ChevronLeft,
  GitBranch,
  Calendar,
  FileText,
  Filter as FunnelIcon,
} from "lucide-react";

interface FunnelLayoutProps {
  project: Project;
  launch: Launch;
  funnel: Funnel;
  activeSection: string;
  children: React.ReactNode;
}

const FUNNEL_NAV = [
  { key: "overview", label: "Обзор", icon: LayoutDashboard, href: (id: string, lid: string, fid: string) => `/projects/${id}/launches/${lid}/funnels/${fid}` },
  { key: "config", label: "Настройка", icon: Settings, href: (id: string, lid: string, fid: string) => `/projects/${id}/launches/${lid}/funnels/${fid}/config` },
  { key: "tracker", label: "Трекер", icon: Activity, href: (id: string, lid: string, fid: string) => `/projects/${id}/launches/${lid}/funnels/${fid}/tracker` },
  { key: "analytics", label: "Аналитика", icon: BarChart3, href: (id: string, lid: string, fid: string) => `/projects/${id}/launches/${lid}/funnels/${fid}/analytics` },
];

const LAUNCH_NAV = [
  { key: "strategy", label: "Стратегия", icon: GitBranch, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/strategy` },
  { key: "funnels", label: "Все воронки", icon: FunnelIcon, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/funnels` },
  { key: "calendar", label: "Контент-план", icon: Calendar, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/calendar` },
  { key: "report", label: "Отчёт", icon: FileText, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/report` },
];

export default function FunnelLayout({ project, launch, funnel, activeSection, children }: FunnelLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar>
        {/* Back */}
        <button
          onClick={() => router.push(`/projects/${project.id}/launches/${launch.id}/funnels`)}
          className="flex items-center gap-2 px-3 py-2 mb-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {launch.name || `Запуск #${launch.number}`}
        </button>

        {/* Funnel name */}
        <div className="px-3 py-2 mb-2 bg-zinc-800/50 rounded-lg border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-0.5">Воронка</p>
          <p className="text-sm font-semibold text-zinc-50 truncate">{funnel.name || "Без названия"}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full text-xs">
            {funnel.templateId}
          </span>
        </div>

        {/* Funnel nav */}
        <div className="space-y-0.5 mb-4">
          {FUNNEL_NAV.map((item) => {
            const active = activeSection === item.key;
            return (
              <button key={item.key}
                onClick={() => router.push(item.href(project.id, launch.id, funnel.id))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-violet-500/15 text-violet-300 font-medium" : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                }`}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Launch nav */}
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1.5">Запуск</p>
          {LAUNCH_NAV.map((item) => (
            <button key={item.key}
              onClick={() => router.push(item.href(project.id, launch.id))}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
      </Sidebar>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
