"use client";

import { useRouter } from "next/navigation";
import { saveLaunch, createEmptyLaunch } from "@/lib/storage";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { Expert, Product } from "@/lib/types";
import { Plus } from "lucide-react";

// ── Progress helpers ──────────────────────────────────────────────────────────

const EXPERT_STRING_KEYS: (keyof Expert)[] = [
  "name", "positioning", "city", "pivotMoment", "backgroundBefore",
  "howCameToNiche", "firstFailure", "firstWinMoment", "personalTransformation",
  "mainExpertise", "methodName", "methodDescription", "methodDifference",
  "personalResults", "achievements", "nicheMythsBusted", "nicheInsiderKnowledge",
  "redLines", "coreBelief", "publicDisagreements", "whatAngersYou",
  "lifeValues", "dailyRoutine", "hobbies", "inspirationSources",
  "signatureLifeTopics", "audienceNickname", "audienceLovesYouFor",
  "audienceCritiquesYouFor", "forbiddenTopics",
];

const PRODUCT_STRING_KEYS: (keyof Product)[] = [
  "name", "duration", "mainResult", "afterResult", "idealStudent",
  "notFor", "mainPain", "transformationA", "transformationB", "costOfInaction",
  "uniqueAdvantage", "vsCompetitors", "earlyBirdBonus", "mostValuablePart",
  "secretIngredient", "supportFormat", "guarantee",
];

function calcProgress<T extends object>(obj: T, keys: (keyof T)[]): number {
  const filled = keys.filter((k) => {
    const v = obj[k];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return Math.round((filled / keys.length) * 100);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-violet-500 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  planning: { label: "Планирование", className: "bg-zinc-800 text-zinc-400" },
  active: { label: "Активный", className: "bg-violet-500/20 text-violet-400" },
  completed: { label: "Завершён", className: "bg-emerald-500/20 text-emerald-400" },
};

const FORMAT_LABELS: Record<string, string> = {
  course: "Курс",
  mentoring: "Менторство",
  group: "Групповое",
  intensive: "Интенсив",
  marathon: "Марафон",
  other: "Другое",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { project, refreshProject } = useProjectContext();

  const handleNewLaunch = () => {
    if (!project) return;
    const launch = createEmptyLaunch(project.launches.length + 1);
    saveLaunch(project.id, launch);
    refreshProject();
    router.push(`/projects/${project.id}/launches/${launch.id}`);
  };

  if (!project) return null;

  const expertPct = calcProgress(project.expert, EXPERT_STRING_KEYS);
  const productPct = calcProgress(project.product, PRODUCT_STRING_KEYS);
  const recentLaunches = project.launches.slice(-3).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ── ЭКСПЕРТ ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">👤</span>
          <h2 className="font-semibold text-zinc-50">Эксперт</h2>
          <span className="ml-auto text-xs text-zinc-500">{expertPct}%</span>
        </div>

        <div>
          <p className="font-medium text-zinc-100 truncate">
            {project.expert.name || (
              <span className="text-zinc-500 font-normal">Не заполнено</span>
            )}
          </p>
          {project.expert.positioning && (
            <p className="text-zinc-400 text-sm mt-1 line-clamp-1">
              {project.expert.positioning}
            </p>
          )}
        </div>

        <ProgressBar pct={expertPct} />

        <button
          onClick={() => router.push(`/projects/${params.id}/expert`)}
          className="self-start px-3 py-1.5 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors"
        >
          Редактировать →
        </button>
      </div>

      {/* ── ПРОДУКТ ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📦</span>
          <h2 className="font-semibold text-zinc-50">Продукт</h2>
          <span className="ml-auto text-xs text-zinc-500">{productPct}%</span>
        </div>

        <div>
          <p className="font-medium text-zinc-100 truncate">
            {project.product.name || (
              <span className="text-zinc-500 font-normal">Не заполнено</span>
            )}
          </p>
          {(project.product.format || project.product.price > 0) && (
            <p className="text-zinc-400 text-sm mt-1">
              {FORMAT_LABELS[project.product.format] ?? project.product.format}
              {project.product.price > 0 &&
                ` · ${project.product.price.toLocaleString()} ${project.product.currency}`}
            </p>
          )}
        </div>

        <ProgressBar pct={productPct} />

        <button
          onClick={() => router.push(`/projects/${params.id}/product`)}
          className="self-start px-3 py-1.5 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors"
        >
          Редактировать →
        </button>
      </div>

      {/* ── АУДИТОРИЯ ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">👥</span>
          <h2 className="font-semibold text-zinc-50">Аудитория</h2>
        </div>

        <p className="text-zinc-400 text-sm">
          {project.audience.archetypes.length} архетипов
          {" · "}
          {project.audience.pains.filter(Boolean).length} болей
          {" · "}
          {project.audience.fears.filter(Boolean).length} страхов
        </p>

        <button
          onClick={() => router.push(`/projects/${params.id}/audience`)}
          className="self-start px-3 py-1.5 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors mt-auto"
        >
          Редактировать →
        </button>
      </div>

      {/* ── ЗАПУСКИ ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <h2 className="font-semibold text-zinc-50">Запуски</h2>
        </div>

        {recentLaunches.length === 0 ? (
          <p className="text-zinc-500 text-sm">Запусков пока нет</p>
        ) : (
          <div className="space-y-2">
            {recentLaunches.map((launch) => {
              const badge = STATUS_BADGE[launch.status];
              return (
                <button
                  key={launch.id}
                  onClick={() =>
                    router.push(`/projects/${params.id}/launches/${launch.id}`)
                  }
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-sm text-zinc-200 truncate">
                    #{launch.number} {launch.name || "Запуск"}
                  </span>
                  <span
                    className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-zinc-800">
          <button
            onClick={() => router.push(`/projects/${params.id}/launches`)}
            className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Все запуски
          </button>
          <button
            onClick={handleNewLaunch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Новый запуск
          </button>
        </div>
      </div>
    </div>
  );
}
