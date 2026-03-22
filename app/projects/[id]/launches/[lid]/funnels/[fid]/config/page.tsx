"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, getFunnel, saveFunnel } from "@/lib/storage";
import { Project, Launch, Funnel, FunnelStep, UTMSource } from "@/lib/types";
import FunnelLayout from "@/components/layout/FunnelLayout";
import { generateUTMUrl, getDefaultSources } from "@/lib/utm";
import { nanoid } from "@/lib/storage";
import { Plus, Trash2, Copy, Check } from "lucide-react";

export default function FunnelConfigPage({ params }: { params: { id: string; lid: string; fid: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) { router.push("/"); return; }
    const l = getLaunch(params.id, params.lid);
    if (!l) { router.push(`/projects/${params.id}`); return; }
    const f = getFunnel(params.id, params.lid, params.fid);
    if (!f) { router.push(`/projects/${params.id}/launches/${params.lid}/funnels`); return; }
    setProject(p);
    setLaunch(l);
    setFunnel(JSON.parse(JSON.stringify(f)));
  }, [params, router]);

  const handleSave = () => {
    if (!project || !launch || !funnel) return;
    setSaving(true);
    saveFunnel(project.id, launch.id, funnel);
    setTimeout(() => setSaving(false), 600);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const addStep = () => {
    if (!funnel) return;
    const step: FunnelStep = { id: nanoid(), name: "", order: funnel.steps.length + 1, plan: 0, fact: 0 };
    setFunnel({ ...funnel, steps: [...funnel.steps, step] });
  };

  const updateStep = (sid: string, key: keyof FunnelStep, value: unknown) => {
    if (!funnel) return;
    setFunnel({ ...funnel, steps: funnel.steps.map((s) => s.id === sid ? { ...s, [key]: value } : s) });
  };

  const removeStep = (sid: string) => {
    if (!funnel) return;
    setFunnel({ ...funnel, steps: funnel.steps.filter((s) => s.id !== sid) });
  };

  const addSource = () => {
    if (!funnel) return;
    const src: UTMSource = { id: nanoid(), label: "", utmSource: "", utmContent: "", hint: "" };
    setFunnel({ ...funnel, utm: { ...funnel.utm, sources: [...funnel.utm.sources, src] } });
  };

  const loadDefaultSources = () => {
    if (!funnel) return;
    const sources = getDefaultSources(funnel.templateId);
    setFunnel({ ...funnel, utm: { ...funnel.utm, sources } });
  };

  const updateSource = (sid: string, key: keyof UTMSource, value: string) => {
    if (!funnel) return;
    setFunnel({ ...funnel, utm: { ...funnel.utm, sources: funnel.utm.sources.map((s) => s.id === sid ? { ...s, [key]: value } : s) } });
  };

  const removeSource = (sid: string) => {
    if (!funnel) return;
    setFunnel({ ...funnel, utm: { ...funnel.utm, sources: funnel.utm.sources.filter((s) => s.id !== sid) } });
  };

  if (!project || !launch || !funnel) return null;

  return (
    <FunnelLayout project={project} launch={launch} funnel={funnel} activeSection="config">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Настройка воронки</h1>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors">
            {saving ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>

        {/* Basic settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Основное</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Название воронки</label>
              <input type="text" value={funnel.name}
                onChange={(e) => setFunnel({ ...funnel, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Шаблон</label>
              <select value={funnel.templateId}
                onChange={(e) => setFunnel({ ...funnel, templateId: e.target.value as Funnel["templateId"] })}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                <option value="anketa">Анкета</option>
                <option value="webinar">Вебинар</option>
                <option value="marathon">Марафон</option>
                <option value="direct">Прямые продажи</option>
                <option value="custom">Своя схема</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Базовый URL</label>
              <input type="url" value={funnel.baseUrl}
                onChange={(e) => setFunnel({ ...funnel, baseUrl: e.target.value })}
                placeholder="https://example.com/landing"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        {/* UTM config */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">UTM настройки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Campaign</label>
              <input type="text" value={funnel.utm.campaign}
                onChange={(e) => setFunnel({ ...funnel, utm: { ...funnel.utm, campaign: e.target.value } })}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Medium</label>
              <input type="text" value={funnel.utm.medium}
                onChange={(e) => setFunnel({ ...funnel, utm: { ...funnel.utm, medium: e.target.value } })}
                placeholder="social"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-300">Источники</h3>
            <div className="flex gap-2">
              <button onClick={loadDefaultSources}
                className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                Загрузить дефолтные
              </button>
              <button onClick={addSource}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Добавить
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {funnel.utm.sources.map((src) => {
              const url = funnel.baseUrl ? generateUTMUrl(funnel.baseUrl, src, funnel.utm) : "";
              return (
                <div key={src.id} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" value={src.label} onChange={(e) => updateSource(src.id, "label", e.target.value)}
                      placeholder="Название" className="px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                    <input type="text" value={src.utmSource} onChange={(e) => updateSource(src.id, "utmSource", e.target.value)}
                      placeholder="utm_source" className="px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                    <input type="text" value={src.utmContent} onChange={(e) => updateSource(src.id, "utmContent", e.target.value)}
                      placeholder="utm_content" className="px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </div>
                  {url && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="flex-1 text-xs text-zinc-500 font-mono truncate">{url}</p>
                      <button onClick={() => copyUrl(url, src.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs text-zinc-400 transition-colors">
                        {copied === src.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                  {src.hint && <p className="text-xs text-zinc-600 mt-1">{src.hint}</p>}
                  <div className="flex justify-end mt-2">
                    <button onClick={() => removeSource(src.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel steps */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Шаги воронки</h2>
            <button onClick={addStep}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Добавить шаг
            </button>
          </div>
          <div className="space-y-2">
            {funnel.steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-700 text-zinc-400 text-xs font-bold flex-shrink-0">{i + 1}</span>
                <input type="text" value={step.name} onChange={(e) => updateStep(step.id, "name", e.target.value)}
                  placeholder="Название шага" className="flex-1 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-zinc-500">план:</span>
                  <input type="number" value={step.plan} onChange={(e) => updateStep(step.id, "plan", Number(e.target.value))}
                    className="w-20 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none text-center" />
                </div>
                <button onClick={() => removeStep(step.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FunnelLayout>
  );
}
