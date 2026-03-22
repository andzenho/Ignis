"use client";

import { useRouter } from "next/navigation";
import { saveLaunch, createEmptyLaunch } from "@/lib/storage";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { Plus, Rocket, Calendar, TrendingUp, Clock } from "lucide-react";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { project, refreshProject } = useProjectContext();

  const handleNewLaunch = () => {
    if (!project) return;
    const launch = createEmptyLaunch(project.launches.length + 1);
    saveLaunch(project.id, launch);
    refreshProject();
    router.push(`/projects/${project.id}/launches/${launch.id}`);
  };

  if (!project) return null;

  const statusLabels = {
    planning: { label: "Планирование", color: "text-zinc-400", bg: "bg-zinc-800" },
    active: { label: "Активный", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    completed: { label: "Завершён", color: "text-zinc-500", bg: "bg-zinc-800/50" },
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Запусков</p>
            <p className="text-2xl font-bold text-zinc-50">{project.launches.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Активных</p>
            <p className="text-2xl font-bold text-emerald-400">
              {project.launches.filter((l) => l.status === "active").length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Завершённых</p>
            <p className="text-2xl font-bold text-zinc-400">
              {project.launches.filter((l) => l.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Launches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-50">Запуски</h2>
            <button
              onClick={handleNewLaunch}
              className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Новый запуск
            </button>
          </div>

          {project.launches.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
              <Rocket className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 mb-4">Нет запусков</p>
              <button
                onClick={handleNewLaunch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Создать первый запуск
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.launches.map((launch) => {
                const s = statusLabels[launch.status];
                return (
                  <button
                    key={launch.id}
                    onClick={() => router.push(`/projects/${project.id}/launches/${launch.id}`)}
                    className="w-full text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800">
                          <Rocket className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-50">
                            #{launch.number} {launch.name || "Запуск"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {launch.funnels.length} воронок
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    {launch.salesStartDate && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-3 pl-12">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Старт продаж:{" "}
                          {new Date(launch.salesStartDate).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
