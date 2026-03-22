"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Project, Launch } from "@/lib/types";
import {
  LayoutDashboard,
  GitBranch,
  Filter,
  Calendar,
  BarChart3,
  FileText,
  ChevronLeft,
  User,
  Package,
  Users,
  Rocket,
} from "lucide-react";

interface LaunchLayoutProps {
  project: Project;
  launch: Launch;
  activeSection: string;
  children: React.ReactNode;
}

const PROJECT_NAV = [
  { key: "expert", label: "Эксперт", icon: User, href: (id: string) => `/projects/${id}/expert` },
  { key: "product", label: "Продукт", icon: Package, href: (id: string) => `/projects/${id}/product` },
  { key: "audience", label: "Аудитория", icon: Users, href: (id: string) => `/projects/${id}/audience` },
];

const LAUNCH_NAV = [
  { key: "overview", label: "Обзор", icon: LayoutDashboard, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}` },
  { key: "strategy", label: "Стратегия", icon: GitBranch, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/strategy` },
  { key: "funnels", label: "Воронки", icon: Filter, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/funnels` },
  { key: "calendar", label: "Контент-план", icon: Calendar, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/calendar` },
  { key: "analytics", label: "Аналитика", icon: BarChart3, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/analytics` },
  { key: "report", label: "Отчёт", icon: FileText, href: (id: string, lid: string) => `/projects/${id}/launches/${lid}/report` },
];

export default function LaunchLayout({ project, launch, activeSection, children }: LaunchLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar>
        {/* Back to project */}
        <button
          onClick={() => router.push(`/projects/${project.id}`)}
          className="flex items-center gap-2 px-3 py-2 mb-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {project.name || "Проект"}
        </button>

        {/* Launch name */}
        <div className="px-3 py-2 mb-2 bg-zinc-800/50 rounded-lg border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-0.5">Запуск #{launch.number}</p>
          <p className="text-sm font-semibold text-zinc-50 truncate">{launch.name || "Без названия"}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            launch.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
            launch.status === "completed" ? "bg-zinc-800 text-zinc-500" :
            "bg-zinc-800 text-zinc-400"
          }`}>
            {launch.status === "active" ? "Активный" : launch.status === "completed" ? "Завершён" : "Планирование"}
          </span>
        </div>

        {/* Launch nav */}
        <div className="space-y-0.5 mb-4">
          {LAUNCH_NAV.map((item) => {
            const active = activeSection === item.key;
            return (
              <button key={item.key}
                onClick={() => router.push(item.href(project.id, launch.id))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-violet-500/15 text-violet-300 font-medium" : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                }`}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Funnel shortcuts */}
        {launch.funnels.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1.5">Воронки</p>
            {launch.funnels.map((f) => (
              <button key={f.id}
                onClick={() => router.push(`/projects/${project.id}/launches/${launch.id}/funnels/${f.id}`)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors truncate">
                <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{f.name || "Без названия"}</span>
              </button>
            ))}
          </div>
        )}

        {/* Project info */}
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1.5">Проект</p>
          {PROJECT_NAV.map((item) => (
            <button key={item.key}
              onClick={() => router.push(item.href(project.id))}
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
