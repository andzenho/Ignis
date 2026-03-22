"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useProjectContext } from "@/lib/context/ProjectContext";
import { ChevronLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 text-sm rounded-r-lg border-l-2 transition-colors",
        active
          ? "bg-zinc-800 border-violet-500 text-white font-medium"
          : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
      )}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { project } = useProjectContext();

  const id = params.id as string;
  const lid = params.lid as string | undefined;

  const isInLaunch = !!lid;

  // Find current launch from project launches
  const currentLaunch = isInLaunch && project
    ? project.launches.find((l) => l.id === lid) ?? null
    : null;

  const projectNav = [
    { label: "👤 Эксперт", href: `/projects/${id}/expert` },
    { label: "📦 Продукт", href: `/projects/${id}/product` },
    { label: "👥 Аудитория", href: `/projects/${id}/audience` },
    { label: "🚀 Все запуски", href: `/projects/${id}/launches` },
  ];

  const launchNav = [
    { label: "🏠 Launch HQ", href: `/projects/${id}/launches/${lid}` },
    { label: "🗺️ Стратегия", href: `/projects/${id}/launches/${lid}/strategy` },
    { label: "🔗 Воронки", href: `/projects/${id}/launches/${lid}/funnels` },
    { label: "📅 Календарь", href: `/projects/${id}/launches/${lid}/calendar` },
    { label: "📊 Аналитика", href: `/projects/${id}/launches/${lid}/analytics` },
    { label: "📋 Отчёт", href: `/projects/${id}/launches/${lid}/report` },
  ];

  const handleNewLaunch = () => {
    // Navigate to launches page where user can create a new one
    router.push(`/projects/${id}/launches`);
  };

  return (
    <aside
      className="fixed left-0 top-0 flex flex-col bg-zinc-900 border-r border-zinc-800 h-screen"
      style={{ width: 240 }}
    >
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-zinc-800 flex-shrink-0">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="font-bold text-violet-500 text-xl leading-none">🔥 Ignis</span>
          {project && (
            <span className="text-zinc-400 text-xs truncate max-w-[180px]">{project.name}</span>
          )}
        </Link>
      </div>

      {/* Nav content */}
      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
        {/* ZONE 1: Project nav */}
        {!isInLaunch && (
          <div>
            <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Проект
            </p>
            <div className="space-y-0.5">
              {projectNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <NavItem key={item.href} href={item.href} label={item.label} active={active} />
                );
              })}
            </div>
          </div>
        )}

        {/* ZONE 2: Launch nav */}
        {isInLaunch && (
          <div className="flex flex-col gap-3">
            {/* Launch dropdown */}
            {project && project.launches.length > 0 && (
              <div className="px-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Запуск
                </p>
                <select
                  value={lid}
                  onChange={(e) => router.push(`/projects/${id}/launches/${e.target.value}`)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 rounded-lg px-2 py-1.5 focus:outline-none focus:border-violet-500"
                >
                  {project.launches.map((l) => (
                    <option key={l.id} value={l.id}>
                      #{l.number} {l.name || "Запуск"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Launch links */}
            <div className="space-y-0.5">
              {launchNav.map((item) => {
                // exact match for HQ, prefix match for rest
                const active =
                  item.href === `/projects/${id}/launches/${lid}`
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <NavItem key={item.href} href={item.href} label={item.label} active={active} />
                );
              })}
            </div>

            {/* New launch button */}
            <div className="px-3">
              <button
                onClick={handleNewLaunch}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Новый запуск
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom: all projects */}
      <div className="px-3 py-3 border-t border-zinc-800 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Все проекты
        </Link>
      </div>
    </aside>
  );
}
