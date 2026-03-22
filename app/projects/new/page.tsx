"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmptyProject, saveProject } from "@/lib/storage";
import { ArrowLeft, Flame } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [expertName, setExpertName] = useState("");

  const handleCreate = () => {
    const project = createEmptyProject();
    project.name = name || "Новый проект";
    project.expert.name = expertName;
    saveProject(project);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-zinc-50">Новый проект</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h1 className="text-xl font-bold text-zinc-50 mb-6">
            Создать проект
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Название проекта
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Курс по маркетингу 2025"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Имя эксперта
              </label>
              <input
                type="text"
                value={expertName}
                onChange={(e) => setExpertName(e.target.value)}
                placeholder="Имя и фамилия"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.push("/")}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
