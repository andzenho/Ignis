"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects } from "@/lib/storage";
import { Project } from "@/lib/types";
import { Plus } from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  planning: { label: "Планирование", className: "bg-zinc-800 text-zinc-400" },
  active: { label: "Активный", className: "bg-violet-500/20 text-violet-400" },
  completed: { label: "Завершён", className: "bg-emerald-500/20 text-emerald-400" },
};

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const lastLaunch = (p: Project) =>
    p.launches.length > 0 ? p.launches[p.launches.length - 1] : null;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-zinc-800 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-violet-500">🔥 Ignis</span>
          <span className="text-zinc-500 text-sm hidden sm:block">
            Штаб управления запусками
          </span>
        </div>
        <button
          onClick={() => router.push("/projects/new")}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать проект
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {projects.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">🚀</span>
            <p className="text-zinc-400 text-lg font-medium">Создайте первый проект</p>
            <p className="text-zinc-600 text-sm">Все ваши запуски будут здесь</p>
            <button
              onClick={() => router.push("/projects/new")}
              className="mt-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Начать
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const last = lastLaunch(project);
              const badge = last ? STATUS_BADGE[last.status] : null;
              return (
                <button
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="text-left bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 cursor-pointer transition-colors flex flex-col gap-3"
                >
                  {/* Name */}
                  <p className="font-semibold text-lg text-zinc-50 leading-tight truncate">
                    {project.name || "Без названия"}
                  </p>

                  {/* Expert */}
                  {project.expert.name && (
                    <p className="text-zinc-400 text-sm truncate">{project.expert.name}</p>
                  )}

                  {/* Product */}
                  {project.product.name && (
                    <p className="text-zinc-400 text-sm truncate">{project.product.name}</p>
                  )}

                  {/* Launches row */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-zinc-500 text-sm">
                      {project.launches.length}{" "}
                      {project.launches.length === 1
                        ? "запуск"
                        : project.launches.length < 5
                        ? "запуска"
                        : "запусков"}
                    </span>
                    {badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    )}
                  </div>

                  {/* Updated */}
                  <p className="text-zinc-500 text-xs">
                    {new Date(project.updatedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </button>
              );
            })}

            {/* Add card */}
            <button
              onClick={() => router.push("/projects/new")}
              className="flex flex-col items-center justify-center gap-2 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-colors min-h-[160px]"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
                <Plus className="w-5 h-5 text-zinc-500" />
              </div>
              <span className="text-sm text-zinc-500">Новый проект</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
