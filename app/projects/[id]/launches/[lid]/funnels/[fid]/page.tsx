"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, getFunnel, saveFunnel } from "@/lib/storage";
import { Project, Launch, Funnel } from "@/lib/types";
import FunnelLayout from "@/components/layout/FunnelLayout";
import { Settings, BarChart3, Activity } from "lucide-react";

export default function FunnelPage({ params }: { params: { id: string; lid: string; fid: string } }) {
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

  const quickLinks = [
    { icon: Settings, label: "Настройка", href: `/projects/${params.id}/launches/${params.lid}/funnels/${params.fid}/config` },
    { icon: Activity, label: "Трекер", href: `/projects/${params.id}/launches/${params.lid}/funnels/${params.fid}/tracker` },
    { icon: BarChart3, label: "Аналитика", href: `/projects/${params.id}/launches/${params.lid}/funnels/${params.fid}/analytics` },
  ];

  return (
    <FunnelLayout project={project} launch={launch} funnel={funnel} activeSection="overview">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button key={link.href} onClick={() => router.push(link.href)}
              className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <link.icon className="w-4 h-4 text-violet-400" />
              </div>
              <span className="font-medium text-zinc-200 text-sm">{link.label}</span>
            </button>
          ))}
        </div>

        {/* Funnel steps overview */}
        {funnel.steps.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Шаги воронки</h2>
            <div className="flex items-end gap-2">
              {funnel.steps.map((step, i) => {
                const maxPlan = Math.max(...funnel.steps.map((s) => s.plan), 1);
                const heightPlan = Math.max((step.plan / maxPlan) * 100, 10);
                const heightFact = step.plan > 0 ? Math.min((step.fact / step.plan) * heightPlan, 150) : 0;
                return (
                  <div key={step.id} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full relative" style={{ height: "100px" }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-zinc-700 rounded-t"
                        style={{ height: `${heightPlan}%` }} />
                      <div className={`absolute bottom-0 left-0 right-0 rounded-t opacity-80 ${step.fact >= step.plan ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ height: `${heightFact}%` }} />
                    </div>
                    <p className="text-xs text-zinc-500 text-center truncate w-full">{step.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FunnelLayout>
  );
}
