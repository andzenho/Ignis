"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createEmptyProject, saveProject } from "@/lib/storage";
import { Project } from "@/lib/types";
import { Plus, Flame, Calendar, TrendingUp } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleNewProject = () => {
    router.push("/projects/new");
  };

  const handleOpenProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/20">
            <Flame className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-50">Ignis</h1>
            <p className="text-xs text-zinc-500">Launch Management System</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-50">Проекты</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Управляйте запусками ваших курсов
            </p>
          </div>
          <button
            onClick={handleNewProject}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Новый проект
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto mb-4">
              <Flame className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400 mb-2">
              Нет проектов
            </h3>
            <p className="text-sm text-zinc-600 mb-6">
              Создайте первый проект, чтобы начать работу
            </p>
            <button
              onClick={handleNewProject}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать проект
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                className="text-left p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <Flame className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-xs text-zinc-600 group-hover:text-zinc-500">
                    {project.launches.length} запусков
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-50 mb-1">
                  {project.name || "Без названия"}
                </h3>
                <p className="text-xs text-zinc-500">
                  {project.expert.name || "Эксперт не указан"}
                </p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  {project.launches.some((l) => l.status === "active") && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Активный запуск</span>
                    </div>
                  )}
                </div>
              </button>
            ))}

            {/* New project card */}
            <button
              onClick={handleNewProject}
              className="text-left p-5 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-2 min-h-[140px]"
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
