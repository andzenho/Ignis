"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, saveLaunch } from "@/lib/storage";
import { Project, Launch, SalesWindow, SalesWindowStep } from "@/lib/types";
import LaunchLayout from "@/components/layout/LaunchLayout";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { nanoid } from "@/lib/storage";

const TEMPLATES = [
  { id: "anketa", label: "Анкета" },
  { id: "webinar", label: "Вебинар" },
  { id: "marathon", label: "Марафон" },
  { id: "direct", label: "Прямые продажи" },
  { id: "custom", label: "Своя схема" },
];

const STEP_TYPES = [
  { value: "warmup", label: "Прогрев" },
  { value: "anketa", label: "Анкета" },
  { value: "bot", label: "Бот" },
  { value: "landing", label: "Лендинг" },
  { value: "closed_tg", label: "Закрытый ТГ" },
  { value: "closed_stream", label: "Закрытый стрим" },
  { value: "marathon", label: "Марафон" },
  { value: "webinar", label: "Вебинар" },
  { value: "sales_open", label: "Открытые продажи" },
];

export default function StrategyPage({ params }: { params: { id: string; lid: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) { router.push("/"); return; }
    const l = getLaunch(params.id, params.lid);
    if (!l) { router.push(`/projects/${params.id}`); return; }
    setProject(p);
    setLaunch(JSON.parse(JSON.stringify(l)));
  }, [params.id, params.lid, router]);

  const handleSave = () => {
    if (!project || !launch) return;
    setSaving(true);
    saveLaunch(project.id, launch);
    setTimeout(() => setSaving(false), 600);
  };

  const addWindow = () => {
    if (!launch) return;
    const win: SalesWindow = { id: nanoid(), templateId: "custom", name: "Новое окно", steps: [] };
    setLaunch({ ...launch, strategy: { salesWindows: [...launch.strategy.salesWindows, win] } });
  };

  const removeWindow = (wid: string) => {
    if (!launch) return;
    setLaunch({ ...launch, strategy: { salesWindows: launch.strategy.salesWindows.filter((w) => w.id !== wid) } });
  };

  const updateWindow = (wid: string, key: keyof SalesWindow, value: unknown) => {
    if (!launch) return;
    setLaunch({
      ...launch,
      strategy: {
        salesWindows: launch.strategy.salesWindows.map((w) => w.id === wid ? { ...w, [key]: value } : w),
      },
    });
  };

  const addStep = (wid: string) => {
    if (!launch) return;
    const step: SalesWindowStep = { id: nanoid(), type: "warmup", label: "", durationDays: 7, notes: "" };
    setLaunch({
      ...launch,
      strategy: {
        salesWindows: launch.strategy.salesWindows.map((w) =>
          w.id === wid ? { ...w, steps: [...w.steps, step] } : w
        ),
      },
    });
  };

  const updateStep = (wid: string, sid: string, key: keyof SalesWindowStep, value: unknown) => {
    if (!launch) return;
    setLaunch({
      ...launch,
      strategy: {
        salesWindows: launch.strategy.salesWindows.map((w) =>
          w.id === wid ? {
            ...w, steps: w.steps.map((s) => s.id === sid ? { ...s, [key]: value } : s)
          } : w
        ),
      },
    });
  };

  const removeStep = (wid: string, sid: string) => {
    if (!launch) return;
    setLaunch({
      ...launch,
      strategy: {
        salesWindows: launch.strategy.salesWindows.map((w) =>
          w.id === wid ? { ...w, steps: w.steps.filter((s) => s.id !== sid) } : w
        ),
      },
    });
  };

  if (!project || !launch) return null;

  return (
    <LaunchLayout project={project} launch={launch} activeSection="strategy">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Стратегия запуска</h1>
          <div className="flex gap-2">
            <button onClick={addWindow}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Добавить окно
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors">
              {saving ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </div>

        {launch.strategy.salesWindows.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500 mb-4">Нет окон продаж</p>
            <button onClick={addWindow}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Добавить окно продаж
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {launch.strategy.salesWindows.map((win, wi) => (
              <div key={win.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">{wi + 1}</span>
                  <input type="text" value={win.name} onChange={(e) => updateWindow(win.id, "name", e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  <select value={win.templateId} onChange={(e) => updateWindow(win.id, "templateId", e.target.value)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                    {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <button onClick={() => removeWindow(win.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Steps */}
                <div className="space-y-2 ml-10">
                  {win.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg">
                      <GripVertical className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                      <select value={step.type} onChange={(e) => updateStep(win.id, step.id, "type", e.target.value)}
                        className="px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none">
                        {STEP_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <input type="text" value={step.label} onChange={(e) => updateStep(win.id, step.id, "label", e.target.value)}
                        placeholder="Описание шага" className="flex-1 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                      <div className="flex items-center gap-1">
                        <input type="number" value={step.durationDays} onChange={(e) => updateStep(win.id, step.id, "durationDays", Number(e.target.value))}
                          className="w-14 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none text-center" />
                        <span className="text-xs text-zinc-500">дн.</span>
                      </div>
                      <button onClick={() => removeStep(win.id, step.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addStep(win.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Plus className="w-3 h-3" />
                    Добавить шаг
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LaunchLayout>
  );
}
