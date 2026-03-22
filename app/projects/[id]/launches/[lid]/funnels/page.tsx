"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, saveFunnel, createEmptyFunnel } from "@/lib/storage";
import { Project, Launch } from "@/lib/types";
import LaunchLayout from "@/components/layout/LaunchLayout";
import { Plus, Filter as FunnelIcon, TrendingUp, Users } from "lucide-react";

export default function FunnelsPage({ params }: { params: { id: string; lid: string } }) {
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

  const handleNewFunnel = () => {
    if (!project || !launch) return;
    const funnel = createEmptyFunnel();
    saveFunnel(project.id, launch.id, funnel);
    router.push(`/projects/${params.id}/launches/${params.lid}/funnels/${funnel.id}`);
  };

  if (!project || !launch) return null;

  return (
    <LaunchLayout project={project} launch={launch} activeSection="funnels">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Воронки</h1>
          <button onClick={handleNewFunnel}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Новая воронка
          </button>
        </div>

        {launch.funnels.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
            <FunnelIcon className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 mb-4">Нет воронок</p>
            <button onClick={handleNewFunnel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Создать воронку
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {launch.funnels.map((funnel) => {
              const lastStep = funnel.steps[funnel.steps.length - 1];
              return (
                <button key={funnel.id}
                  onClick={() => router.push(`/projects/${params.id}/launches/${params.lid}/funnels/${funnel.id}`)}
                  className="text-left p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <FunnelIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xs text-zinc-600 px-2 py-1 bg-zinc-800 rounded">
                      {funnel.templateId}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-50 mb-1">{funnel.name || "Без названия"}</h3>
                  <p className="text-xs text-zinc-500 mb-3">{funnel.steps.length} шагов</p>
                  {lastStep && (
                    <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-400">План: <span className="text-zinc-50">{lastStep.plan}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-zinc-400">Факт: <span className={lastStep.fact >= lastStep.plan ? "text-emerald-400" : "text-red-400"}>{lastStep.fact}</span></span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
            <button onClick={handleNewFunnel}
              className="flex flex-col items-center justify-center gap-2 p-5 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900 transition-all min-h-[140px]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
                <Plus className="w-5 h-5 text-zinc-500" />
              </div>
              <span className="text-sm text-zinc-500">Новая воронка</span>
            </button>
          </div>
        )}
      </div>
    </LaunchLayout>
  );
}
