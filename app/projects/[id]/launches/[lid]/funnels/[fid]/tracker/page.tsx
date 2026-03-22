"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, getFunnel, saveFunnel } from "@/lib/storage";
import { Project, Launch, Funnel, DailyLog, DailyPost } from "@/lib/types";
import FunnelLayout from "@/components/layout/FunnelLayout";
import { nanoid } from "@/lib/storage";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const PLATFORMS = [
  { value: "tg_main", label: "ТГ канал" },
  { value: "tg_anketa", label: "ТГ анкета" },
  { value: "tg_event", label: "ТГ мероприятие" },
  { value: "ig_reels", label: "IG Reels" },
  { value: "ig_stories", label: "IG Stories" },
  { value: "ig_post", label: "IG Пост" },
];

const MOODS = [
  { value: "good", label: "Хорошо", color: "text-emerald-400" },
  { value: "ok", label: "Нормально", color: "text-yellow-400" },
  { value: "bad", label: "Плохо", color: "text-red-400" },
];

export default function FunnelTrackerPage({ params }: { params: { id: string; lid: string; fid: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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

  const addLog = () => {
    if (!funnel) return;
    const log: DailyLog = {
      id: nanoid(),
      date: new Date().toISOString().split("T")[0],
      notes: "",
      mood: "ok",
      posts: [],
    };
    setFunnel({ ...funnel, dailyLogs: [log, ...funnel.dailyLogs] });
    setExpanded(log.id);
  };

  const updateLog = (lid: string, key: keyof DailyLog, value: unknown) => {
    if (!funnel) return;
    setFunnel({ ...funnel, dailyLogs: funnel.dailyLogs.map((l) => l.id === lid ? { ...l, [key]: value } : l) });
  };

  const removeLog = (lid: string) => {
    if (!funnel) return;
    setFunnel({ ...funnel, dailyLogs: funnel.dailyLogs.filter((l) => l.id !== lid) });
  };

  const addPost = (lid: string) => {
    if (!funnel) return;
    const post: DailyPost = { id: nanoid(), platform: "tg_main", topic: "", reach: 0, reactions: 0 };
    setFunnel({
      ...funnel,
      dailyLogs: funnel.dailyLogs.map((l) => l.id === lid ? { ...l, posts: [...l.posts, post] } : l),
    });
  };

  const updatePost = (lid: string, pid: string, key: keyof DailyPost, value: unknown) => {
    if (!funnel) return;
    setFunnel({
      ...funnel,
      dailyLogs: funnel.dailyLogs.map((l) =>
        l.id === lid ? { ...l, posts: l.posts.map((p) => p.id === pid ? { ...p, [key]: value } : p) } : l
      ),
    });
  };

  const removePost = (lid: string, pid: string) => {
    if (!funnel) return;
    setFunnel({
      ...funnel,
      dailyLogs: funnel.dailyLogs.map((l) =>
        l.id === lid ? { ...l, posts: l.posts.filter((p) => p.id !== pid) } : l
      ),
    });
  };

  if (!project || !launch || !funnel) return null;

  return (
    <FunnelLayout project={project} launch={launch} funnel={funnel} activeSection="tracker">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Ежедневный трекер</h1>
          <div className="flex gap-2">
            <button onClick={addLog}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Добавить день
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors">
              {saving ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </div>

        {funnel.dailyLogs.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500 mb-4">Нет записей</p>
            <button onClick={addLog}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Добавить первый день
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {funnel.dailyLogs.map((log) => (
              <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input type="date" value={log.date}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateLog(log.id, "date", e.target.value)}
                      className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-50 text-sm focus:outline-none" />
                    <div className="flex gap-2">
                      {MOODS.map((m) => (
                        <button key={m.value}
                          onClick={(e) => { e.stopPropagation(); updateLog(log.id, "mood", m.value); }}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${log.mood === m.value ? `${m.color} bg-zinc-800` : "text-zinc-600 hover:text-zinc-400"}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-600">{log.posts.length} постов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); removeLog(log.id); }}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {expanded === log.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>
                </button>

                {expanded === log.id && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    <textarea value={log.notes} onChange={(e) => updateLog(log.id, "notes", e.target.value)}
                      placeholder="Заметки дня..." rows={2}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />

                    <div className="space-y-2">
                      {log.posts.map((post) => (
                        <div key={post.id} className="flex items-center gap-2 p-2.5 bg-zinc-800 rounded-lg">
                          <select value={post.platform} onChange={(e) => updatePost(log.id, post.id, "platform", e.target.value)}
                            className="px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none">
                            {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                          </select>
                          <input type="text" value={post.topic} onChange={(e) => updatePost(log.id, post.id, "topic", e.target.value)}
                            placeholder="Тема поста" className="flex-1 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                          <div className="flex items-center gap-1">
                            <input type="number" value={post.reach} onChange={(e) => updatePost(log.id, post.id, "reach", Number(e.target.value))}
                              placeholder="охват" className="w-16 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none text-center" />
                            <span className="text-xs text-zinc-600">охв</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input type="number" value={post.reactions} onChange={(e) => updatePost(log.id, post.id, "reactions", Number(e.target.value))}
                              placeholder="реакц." className="w-16 px-2 py-1.5 bg-zinc-700 border border-zinc-600 rounded text-zinc-50 text-xs focus:outline-none text-center" />
                            <span className="text-xs text-zinc-600">реак</span>
                          </div>
                          <button onClick={() => removePost(log.id, post.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addPost(log.id)}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        <Plus className="w-3 h-3" />
                        Добавить пост
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FunnelLayout>
  );
}
