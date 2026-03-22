"use client";

import { useProjectContext } from "@/lib/context/ProjectContext";
import { useLaunchContext } from "@/lib/context/LaunchContext";
import { calcTotalRevenue, calcFunnelConversions } from "@/lib/calculations";
import { FileText, Download } from "lucide-react";

export default function ReportPage({ params }: { params: { id: string; lid: string } }) {
  const { project } = useProjectContext();
  const { launch } = useLaunchContext();

  if (!project || !launch) return null;

  const price = project.product.price || 0;
  const revenue = calcTotalRevenue(launch.funnels, price);
  const publishedPosts = launch.calendar.filter((p) => p.status === "published");

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Итоговый отчёт</h1>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Распечатать
          </button>
        </div>

        {/* Header card */}
        <div className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-50">
                #{launch.number} {launch.name || "Запуск"}
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5">{project.name}</p>
              <p className="text-xs text-zinc-500 mt-1">
                Эксперт: {project.expert.name || "Не указан"}
              </p>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Выручка план</p>
            <p className="text-xl font-bold text-zinc-50">{revenue.plan.toLocaleString()} {project.product.currency}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Выручка факт</p>
            <p className={`text-xl font-bold ${revenue.fact >= revenue.plan ? "text-emerald-400" : "text-red-400"}`}>
              {revenue.fact.toLocaleString()} {project.product.currency}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Постов</p>
            <p className="text-xl font-bold text-zinc-50">{publishedPosts.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">Воронок</p>
            <p className="text-xl font-bold text-zinc-50">{launch.funnels.length}</p>
          </div>
        </div>

        {/* Funnels detail */}
        {launch.funnels.map((funnel) => {
          const conversions = calcFunnelConversions(funnel.steps);
          return (
            <div key={funnel.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <h3 className="font-semibold text-zinc-50">{funnel.name || "Без названия"}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{funnel.templateId}</p>
              </div>
              {funnel.steps.length > 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-5 py-3 text-xs text-zinc-400">Шаг</th>
                      <th className="text-right px-5 py-3 text-xs text-zinc-400">План</th>
                      <th className="text-right px-5 py-3 text-xs text-zinc-400">Факт</th>
                      <th className="text-right px-5 py-3 text-xs text-zinc-400">Конверсия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnel.steps.map((step) => {
                      const conv = conversions.find((c) => c.stepId === step.id);
                      return (
                        <tr key={step.id} className="border-b border-zinc-800/50">
                          <td className="px-5 py-3 text-sm text-zinc-200">{step.name}</td>
                          <td className="px-5 py-3 text-right text-sm text-zinc-300">{step.plan}</td>
                          <td className="px-5 py-3 text-right text-sm">
                            <span className={step.fact >= step.plan ? "text-emerald-400" : "text-red-400"}>{step.fact}</span>
                          </td>
                          <td className="px-5 py-3 text-right text-sm text-zinc-400">
                            {conv?.conversion != null ? `${conv.conversion.toFixed(1)}%` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
