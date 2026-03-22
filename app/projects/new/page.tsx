"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmptyProject, saveProject } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [expertName, setExpertName] = useState("");

  const handleCreate = () => {
    const project = createEmptyProject();
    project.name = name.trim() || "Новый проект";
    project.expert.name = expertName.trim();
    saveProject(project);
    router.push(`/projects/${project.id}/expert`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </button>
        <span className="text-xl font-bold text-violet-500">🔥 Ignis</span>
      </header>

      {/* Form */}
      <main className="max-w-md mx-auto mt-20 px-6">
        <h1 className="text-2xl font-bold text-zinc-50 mb-8">Новый проект</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Название проекта
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Игорь Иванов — Системный маркетинг"
              autoFocus
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
              onKeyDown={handleKeyDown}
              placeholder="Имя и фамилия"
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors mt-2"
          >
            Создать проект
          </button>
        </div>
      </main>
    </div>
  );
}
