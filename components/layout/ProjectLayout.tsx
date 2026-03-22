"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Project } from "@/lib/types";
import { User, Package, Users, Rocket, LayoutDashboard } from "lucide-react";

interface ProjectLayoutProps {
  project: Project;
  activeSection: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: "overview", label: "Обзор", icon: LayoutDashboard, href: (id: string) => `/projects/${id}` },
  { key: "expert", label: "Эксперт", icon: User, href: (id: string) => `/projects/${id}/expert` },
  { key: "product", label: "Продукт", icon: Package, href: (id: string) => `/projects/${id}/product` },
  { key: "audience", label: "Аудитория", icon: Users, href: (id: string) => `/projects/${id}/audience` },
  { key: "launches", label: "Запуски", icon: Rocket, href: (id: string) => `/projects/${id}/launches` },
];

export default function ProjectLayout({ project, activeSection, children }: ProjectLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar>
        {/* Project name */}
        <div className="mb-3 px-3 py-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Проект</p>
          <p className="text-sm font-semibold text-zinc-50 truncate">{project.name || "Без названия"}</p>
        </div>

        {/* Nav */}
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href(project.id))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-violet-500/15 text-violet-300 font-medium"
                    : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Launches list */}
        {project.launches.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 mb-1.5">Запуски</p>
            <div className="space-y-0.5">
              {project.launches.map((launch) => (
                <button
                  key={launch.id}
                  onClick={() => router.push(`/projects/${project.id}/launches/${launch.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors truncate"
                >
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 text-[10px] font-bold flex-shrink-0">
                    {launch.number}
                  </span>
                  <span className="truncate">{launch.name || `Запуск #${launch.number}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
