"use client";

import { useEffect, useState } from "react";
import { saveProject } from "@/lib/storage";
import { Audience, Archetype } from "@/lib/types";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "@/lib/storage";

export default function AudiencePage({ params }: { params: { id: string } }) {
  const { project, refreshProject } = useProjectContext();
  const [audience, setAudience] = useState<Audience | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) setAudience(JSON.parse(JSON.stringify(project.audience)));
  }, [project?.id]);

  const handleSave = () => {
    if (!project || !audience) return;
    setSaving(true);
    saveProject({ ...project, audience, updatedAt: new Date().toISOString() });
    refreshProject();
    setTimeout(() => setSaving(false), 600);
  };

  const addArchetype = () => {
    if (!audience) return;
    const newA: Archetype = { id: nanoid(), name: "", age: "", description: "", mainPain: "", mainFear: "" };
    setAudience({ ...audience, archetypes: [...audience.archetypes, newA] });
  };

  const updateArchetype = (id: string, key: keyof Archetype, value: string) => {
    if (!audience) return;
    setAudience({
      ...audience,
      archetypes: audience.archetypes.map((a) => a.id === id ? { ...a, [key]: value } : a),
    });
  };

  const removeArchetype = (id: string) => {
    if (!audience) return;
    setAudience({ ...audience, archetypes: audience.archetypes.filter((a) => a.id !== id) });
  };

  const updateListField = (field: "pains" | "fears" | "objections", index: number, value: string) => {
    if (!audience) return;
    const arr = [...audience[field]];
    arr[index] = value;
    setAudience({ ...audience, [field]: arr });
  };

  const addListItem = (field: "pains" | "fears" | "objections") => {
    if (!audience) return;
    setAudience({ ...audience, [field]: [...audience[field], ""] });
  };

  const removeListItem = (field: "pains" | "fears" | "objections", index: number) => {
    if (!audience) return;
    const arr = [...audience[field]];
    arr.splice(index, 1);
    setAudience({ ...audience, [field]: arr });
  };

  if (!project || !audience) return null;

  const listFields: { key: "pains" | "fears" | "objections"; label: string }[] = [
    { key: "pains", label: "Боли" },
    { key: "fears", label: "Страхи" },
    { key: "objections", label: "Возражения" },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Аудитория</h1>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors">
            {saving ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>

        {/* Archetypes */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Архетипы</h2>
            <button onClick={addArchetype}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Добавить
            </button>
          </div>
          <div className="space-y-4">
            {audience.archetypes.map((arch) => (
              <div key={arch.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex items-start justify-between mb-3">
                  <input type="text" value={arch.name} onChange={(e) => updateArchetype(arch.id, "name", e.target.value)}
                    placeholder="Название архетипа"
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-50 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  <button onClick={() => removeArchetype(arch.id)}
                    className="ml-2 p-2 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Возраст</label>
                    <input type="text" value={arch.age} onChange={(e) => updateArchetype(arch.id, "age", e.target.value)}
                      placeholder="25-35"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Описание</label>
                    <input type="text" value={arch.description} onChange={(e) => updateArchetype(arch.id, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Главная боль</label>
                    <input type="text" value={arch.mainPain} onChange={(e) => updateArchetype(arch.id, "mainPain", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Главный страх</label>
                    <input type="text" value={arch.mainFear} onChange={(e) => updateArchetype(arch.id, "mainFear", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
            ))}
            {audience.archetypes.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">Нет архетипов. Добавьте первый.</p>
            )}
          </div>
        </div>

        {/* Pains, Fears, Objections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listFields.map(({ key, label }) => (
            <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{label}</h2>
                <button onClick={() => addListItem(key)}
                  className="flex items-center justify-center w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {audience[key].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={item} onChange={(e) => updateListField(key, i, e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                    <button onClick={() => removeListItem(key, i)}
                      className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
