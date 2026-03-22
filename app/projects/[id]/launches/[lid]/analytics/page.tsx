"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch } from "@/lib/storage";
import { Project, Launch } from "@/lib/types";
import LaunchLayout from "@/components/layout/LaunchLayout";
import { calcTotalRevenue, calcGap, calcBestSource } from "@/lib/calculations";

export default function LaunchAnalyticsPage({ params }: { params: { id: string; lid: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) { router.push("/"); return; }
    const l = getLaunch(params.id, params.lid);
    if (!l) { router.push(`/projects/${params.id}`); return; }
    setProject(p);
    setLaunch(l);
  }, [params.id, params.lid, router]);

  if (!project || !launch) return null;

  const price = project.product.price || 0;
  const revenue = calcTotalRevenue(launch.funnels, price);
  const gap = calcGap(revenue.plan, revenue.fact);
  const bestSource = calcBestSource(launch.funnels);

  const totalReach = launch.calendar
    .filter((p) => p.status === "published")
    .reduce((sum, p) => sum + p.actualReach, 0);
  const totalReactions = launch.calendar
    .filter((p) => p.status === "published")
    .reduce((sum, p) => sum + p.reactions, 0);

  return (
    <LaunchLayout project={project} launch={launch} activeSection="analytics">
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-zinc-50">Аналитика запуска</h1>

        {/* Revenue */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">План выручки</p>
            <p className="text-xl font-bold text-zinc-50">
              {revenue.plan.toLocaleString()} <span className="text-sm text-zinc-500">{project.product.currency}</span>
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Факт выручки</p>
            <p className={`text-xl font-bold ${revenue.fact >= revenue.plan ? "text-emerald-400" : "text-red-400"}`}>
              {revenue.fact.toLocaleString()} <span className="text-sm text-zinc-500">{project.product.currency}</span>
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Отставание</p>
            <p className={`text-xl font-bold ${gap <= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {gap > 0 ? "-" : "+"}{Math.abs(gap).toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Лучший источник</p>
            <p className="text-sm font-semibold text-violet-400 mt-1">{bestSource || "—"}</p>
          </div>
        </div>

        {/* Content stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Контент</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Постов опубликовано</p>
              <p className="text-2xl font-bold text-zinc-50">
                {launch.calendar.filter((p) => p.status === "published").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Суммарный охват</p>
              <p className="text-2xl font-bold text-violet-400">{totalReach.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Реакций</p>
              <p className="text-2xl font-bold text-emerald-400">{totalReactions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Funnels summary */}
        {launch.funnels.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Воронки</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400">Воронка</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400">Шагов</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400">Вход (план)</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400">Вход (факт)</th>
                </tr>
              </thead>
              <tbody>
                {launch.funnels.map((funnel) => {
                  const firstStep = funnel.steps[0];
                  return (
                    <tr key={funnel.id} className="border-b border-zinc-800/50">
                      <td className="px-5 py-3 text-sm text-zinc-200">{funnel.name || "Без названия"}</td>
                      <td className="px-5 py-3 text-right text-sm text-zinc-400">{funnel.steps.length}</td>
                      <td className="px-5 py-3 text-right text-sm text-zinc-300">{firstStep?.plan ?? "—"}</td>
                      <td className="px-5 py-3 text-right text-sm">
                        {firstStep ? (
                          <span className={firstStep.fact >= firstStep.plan ? "text-emerald-400" : "text-red-400"}>
                            {firstStep.fact}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LaunchLayout>
  );
}
