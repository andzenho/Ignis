"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Home } from "lucide-react";

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-zinc-800">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/20">
          <Flame className="w-4 h-4 text-violet-400" />
        </div>
        <span className="font-bold text-zinc-50 text-sm tracking-tight">Ignis</span>
      </div>

      {/* Home link */}
      <div className="px-3 py-3 border-b border-zinc-800">
        <Link href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors">
          <Home className="w-4 h-4" />
          Все проекты
        </Link>
      </div>

      {/* Navigation content */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {children}
      </nav>
    </aside>
  );
}
