"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, getLaunch, saveLaunch } from "@/lib/storage";
import { Project, Launch, CalendarPost } from "@/lib/types";
import LaunchLayout from "@/components/layout/LaunchLayout";
import { nanoid } from "@/lib/storage";
import { Plus, Trash2 } from "lucide-react";

const PLATFORMS = [
  { value: "tg_main", label: "ТГ канал" },
  { value: "tg_anketa", label: "ТГ анкета" },
  { value: "tg_event", label: "ТГ мероприятие" },
  { value: "ig_reels", label: "IG Reels" },
  { value: "ig_stories", label: "IG Stories" },
  { value: "ig_post", label: "IG Пост" },
];

const STATUS_COLORS = {
  idea: "bg-zinc-700 text-zinc-300",
  ready: "bg-yellow-500/20 text-yellow-400",
  published: "bg-emerald-500/20 text-emerald-400",
};

const WARMUP_COLORS = {
  1: "bg-blue-500/20 text-blue-400",
  2: "bg-yellow-500/20 text-yellow-400",
  3: "bg-orange-500/20 text-orange-400",
  4: "bg-red-500/20 text-red-400",
};

export default function CalendarPage({ params }: { params: { id: string; lid: string } }) {
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

  const addPost = () => {
    if (!launch) return;
    const post: CalendarPost = {
      id: nanoid(),
      date: new Date().toISOString().split("T")[0],
      platform: "tg_main",
      format: "",
      topic: "",
      warmupLevel: 1,
      status: "idea",
      actualReach: 0,
      reactions: 0,
      notes: "",
    };
    setLaunch({ ...launch, calendar: [...launch.calendar, post] });
  };

  const updatePost = (pid: string, key: keyof CalendarPost, value: unknown) => {
    if (!launch) return;
    setLaunch({
      ...launch,
      calendar: launch.calendar.map((p) => p.id === pid ? { ...p, [key]: value } : p),
    });
  };

  const removePost = (pid: string) => {
    if (!launch) return;
    setLaunch({ ...launch, calendar: launch.calendar.filter((p) => p.id !== pid) });
  };

  if (!project || !launch) return null;

  const sorted = [...launch.calendar].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <LaunchLayout project={project} launch={launch} activeSection="calendar">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Контент-план</h1>
          <div className="flex gap-2">
            <button onClick={addPost}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Добавить пост
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors">
              {saving ? "Сохранено ✓" : "Сохранить"}
            </button>
          </div>
        </div>

        {launch.calendar.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-500 mb-4">Нет постов в контент-плане</p>
            <button onClick={addPost}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Добавить первый пост
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-28">Дата</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-32">Платформа</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Тема</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-20">Прогрев</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-24">Статус</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-20">Охват</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((post) => (
                    <tr key={post.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <input type="date" value={post.date} onChange={(e) => updatePost(post.id, "date", e.target.value)}
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-50 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                      </td>
                      <td className="px-4 py-2.5">
                        <select value={post.platform} onChange={(e) => updatePost(post.id, "platform", e.target.value)}
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-50 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500">
                          {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <input type="text" value={post.topic} onChange={(e) => updatePost(post.id, "topic", e.target.value)}
                          placeholder="Тема поста"
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-50 placeholder-zinc-600 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500" />
                      </td>
                      <td className="px-4 py-2.5">
                        <select value={post.warmupLevel} onChange={(e) => updatePost(post.id, "warmupLevel", Number(e.target.value))}
                          className={`w-full px-2 py-1 rounded text-xs focus:outline-none border-0 ${WARMUP_COLORS[post.warmupLevel as keyof typeof WARMUP_COLORS]}`}>
                          <option value={1}>1 — Холод</option>
                          <option value={2}>2 — Тепло</option>
                          <option value={3}>3 — Горячо</option>
                          <option value={4}>4 — Продажи</option>
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <select value={post.status} onChange={(e) => updatePost(post.id, "status", e.target.value)}
                          className={`w-full px-2 py-1 rounded text-xs focus:outline-none border-0 ${STATUS_COLORS[post.status as keyof typeof STATUS_COLORS]}`}>
                          <option value="idea">Идея</option>
                          <option value="ready">Готов</option>
                          <option value="published">Опубликован</option>
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <input type="number" value={post.actualReach} onChange={(e) => updatePost(post.id, "actualReach", Number(e.target.value))}
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-50 text-xs focus:outline-none text-right" />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button onClick={() => removePost(post.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LaunchLayout>
  );
}
