"use client";

import { usePathname, useParams } from "next/navigation";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  expert: "Эксперт",
  product: "Продукт",
  audience: "Аудитория",
  launches: "Все запуски",
  strategy: "Стратегия",
  funnels: "Воронки",
  calendar: "Календарь",
  analytics: "Аналитика",
  report: "Отчёт",
  config: "Настройка",
  tracker: "Трекер",
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  planning: { label: "Планирование", className: "bg-zinc-800 text-zinc-400" },
  active: { label: "Активный", className: "bg-violet-500/20 text-violet-400" },
  completed: { label: "Завершён", className: "bg-emerald-500/20 text-emerald-400" },
};

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const { project } = useProjectContext();

  const id = params.id as string;
  const lid = params.lid as string | undefined;
  const fid = params.fid as string | undefined;

  // Build breadcrumbs
  const parts: string[] = [];

  if (project) {
    parts.push(project.name || "Проект");
  }

  const currentLaunch = lid && project
    ? project.launches.find((l) => l.id === lid) ?? null
    : null;

  if (currentLaunch) {
    parts.push(`Запуск #${currentLaunch.number}${currentLaunch.name ? " — " + currentLaunch.name : ""}`);
  }

  // Detect current section from pathname segments
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && lastSegment !== id && lastSegment !== lid && lastSegment !== fid) {
    const label = SECTION_LABELS[lastSegment];
    if (label) parts.push(label);
  }

  // Current funnel
  if (fid && currentLaunch) {
    const funnel = currentLaunch.funnels.find((f) => f.id === fid);
    if (funnel) {
      const funnelPart = funnel.name || "Воронка";
      // Replace last breadcrumb item if it was already "Воронки"
      if (parts[parts.length - 1] === "Воронки") {
        parts[parts.length - 1] = funnelPart;
      } else {
        parts.push(funnelPart);
      }
    }
  }

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-400">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-zinc-600">/</span>}
            <span className={i === parts.length - 1 ? "text-zinc-100 font-medium" : "text-zinc-400"}>
              {part}
            </span>
          </span>
        ))}
      </nav>

      {/* Status badge */}
      {currentLaunch && (
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            STATUS_BADGE[currentLaunch.status]?.className ?? "bg-zinc-800 text-zinc-400"
          )}
        >
          {STATUS_BADGE[currentLaunch.status]?.label ?? currentLaunch.status}
        </span>
      )}
    </header>
  );
}
