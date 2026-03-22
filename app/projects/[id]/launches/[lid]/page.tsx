"use client";

import { useRouter } from "next/navigation";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { useLaunchContext } from "@/lib/context/LaunchContext";
import { Filter as Funnel, GitBranch, BarChart3, Calendar, FileText } from "lucide-react";

export default function LaunchPage({ params }: { params: { id: string; lid: string } }) {
  const router = useRouter();
  const { project } = useProjectContext();
  const { launch } = useLaunchContext();

  if (!project || !launch) return null;

  const quickLinks = [
    { icon: GitBranch, label: "Стратегия", href: `/projects/${params.id}/launches/${params.lid}/strategy` },
    { icon: Funnel, label: "Воронки", href: `/projects/${params.id}/launches/${params.lid}/funnels` },
    { icon: Calendar, label: "Контент-план", href: `/projects/${params.id}/launches/${params.lid}/calendar` },
    { icon: BarChart3, label: "Аналитика", href: `/projects/${params.id}/launches/${params.lid}/analytics` },
    { icon: FileText, label: "Отчёт", href: `/projects/${params.id}/launches/${params.lid}/report` },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Status bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Воронок</p>
            <p className="text-2xl font-bold text-zinc-50">{launch.funnels.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Постов</p>
            <p className="text-2xl font-bold text-zinc-50">{launch.calendar.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Стратегия</p>
            <p className="text-2xl font-bold text-zinc-50">{launch.strategy.salesWindows.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Статус</p>
            <p className={`text-sm font-semibold mt-1 ${
              launch.status === "active" ? "text-emerald-400" :
              launch.status === "completed" ? "text-zinc-500" : "text-zinc-300"
            }`}>
              {launch.status === "active" ? "Активный" :
               launch.status === "completed" ? "Завершён" : "Планирование"}
            </p>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <button key={link.href} onClick={() => router.push(link.href)}
              className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all text-left">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <link.icon className="w-4 h-4 text-violet-400" />
              </div>
              <span className="font-medium text-zinc-200 text-sm">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
