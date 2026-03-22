"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, getFunnel } from "@/lib/storage";
import { Project, Launch, Funnel } from "@/lib/types";
import FunnelLayout from "@/components/layout/FunnelLayout";
import { calcFunnelConversions } from "@/lib/calculations";

export default function FunnelAnalyticsPage({ params }: { params: { id: string; lid: string; fid: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) { router.push("/"); return; }
    const l = getLaunch(params.id, params.lid);
    if (!l) { router.push(`/projects/${params.id}`); return; }
    const f = getFunnel(params.id, params.lid, params.fid);
    if (!f) { router.push(`/projects/${params.id}/launches/${params.lid}/funnels`); return; }
    setProject(p);
    setLaunch(l);
    setFunnel(f);
  }, [params, router]);

  if (!project || !launch || !funnel) return null;

  const conversions = calcFunnelConversions(funnel.steps);

  return (
    <FunnelLayout project={project} launch={launch} funnel={funnel} activeSection="analytics">
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-zinc-50">Аналитика воронки</h1>

        {/* Conversion table */}
        {funnel.steps.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500">Нет шагов в воронке. Добавьте их в настройках.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Шаг</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">План</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Факт</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Конверсия</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Выполнение</th>
                </tr>
              </thead>
              <tbody>
                {funnel.steps.map((step, i) => {
                  const conv = conversions.find((c) => c.stepId === step.id);
                  const pct = step.plan > 0 ? Math.round((step.fact / step.plan) * 100) : null;
                  return (
                    <tr key={step.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold">{i + 1}</span>
                          <span className="text-sm text-zinc-200">{step.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-sm text-zinc-300">{step.plan.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-sm font-medium">
                        <span className={step.fact >= step.plan ? "text-emerald-400" : "text-red-400"}>
                          {step.fact.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm text-zinc-400">
                        {conv?.conversion != null ? `${conv.conversion.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {pct != null && (
                            <>
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${pct >= 100 ? "text-emerald-400" : pct >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                                {pct}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Daily posts stats */}
        {funnel.dailyLogs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Статистика постов</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Всего постов</p>
                <p className="text-2xl font-bold text-zinc-50">
                  {funnel.dailyLogs.reduce((sum, l) => sum + l.posts.length, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Суммарный охват</p>
                <p className="text-2xl font-bold text-violet-400">
                  {funnel.dailyLogs.reduce((sum, l) => sum + l.posts.reduce((s, p) => s + p.reach, 0), 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Реакций</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {funnel.dailyLogs.reduce((sum, l) => sum + l.posts.reduce((s, p) => s + p.reactions, 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FunnelLayout>
  );
}
