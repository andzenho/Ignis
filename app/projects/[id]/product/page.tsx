"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject, saveProject } from "@/lib/storage";
import { Project, Product } from "@/lib/types";
import ProjectLayout from "@/components/layout/ProjectLayout";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) { router.push("/"); return; }
    setProject(p);
    setProduct({ ...p.product });
  }, [params.id, router]);

  const handleChange = (key: keyof Product, value: unknown) => {
    setProduct((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = () => {
    if (!project || !product) return;
    setSaving(true);
    const updated = { ...project, product, updatedAt: new Date().toISOString() };
    saveProject(updated);
    setProject(updated);
    setTimeout(() => setSaving(false), 600);
  };

  if (!project || !product) return null;

  return (
    <ProjectLayout project={project} activeSection="product">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Продукт</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>

        {/* Main info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Основное</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Название продукта</label>
              <input type="text" value={product.name} onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Формат</label>
              <select value={product.format} onChange={(e) => handleChange("format", e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                <option value="course">Курс</option>
                <option value="mentoring">Менторство</option>
                <option value="group">Групповое</option>
                <option value="intensive">Интенсив</option>
                <option value="marathon">Марафон</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Длительность</label>
              <input type="text" value={product.duration} onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="Например: 3 месяца"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Цена</label>
              <div className="flex gap-2">
                <input type="number" value={product.price} onChange={(e) => handleChange("price", Number(e.target.value))}
                  className="flex-1 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                <select value={product.currency} onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-24 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Главный результат</label>
              <textarea value={product.mainResult} onChange={(e) => handleChange("mainResult", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Результат после прохождения</label>
              <textarea value={product.afterResult} onChange={(e) => handleChange("afterResult", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
          </div>
        </div>

        {/* Target */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Целевая аудитория</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Идеальный студент</label>
              <textarea value={product.idealStudent} onChange={(e) => handleChange("idealStudent", e.target.value)}
                rows={3} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Не для кого</label>
              <textarea value={product.notFor} onChange={(e) => handleChange("notFor", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Главная боль</label>
              <textarea value={product.mainPain} onChange={(e) => handleChange("mainPain", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Трансформация: точка А</label>
              <textarea value={product.transformationA} onChange={(e) => handleChange("transformationA", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Трансформация: точка Б</label>
              <textarea value={product.transformationB} onChange={(e) => handleChange("transformationB", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Цена бездействия</label>
              <textarea value={product.costOfInaction} onChange={(e) => handleChange("costOfInaction", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
          </div>
        </div>

        {/* Offer details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Оффер</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Уникальное преимущество</label>
              <textarea value={product.uniqueAdvantage} onChange={(e) => handleChange("uniqueAdvantage", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Vs конкуренты</label>
              <textarea value={product.vsCompetitors} onChange={(e) => handleChange("vsCompetitors", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ранний бёрд / бонус</label>
              <input type="text" value={product.earlyBirdBonus} onChange={(e) => handleChange("earlyBirdBonus", e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Лимит мест</label>
              <input type="number" value={product.spotsLimit ?? ""} onChange={(e) => handleChange("spotsLimit", e.target.value ? Number(e.target.value) : null)}
                placeholder="Без лимита"
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Гарантия</label>
              <textarea value={product.guarantee} onChange={(e) => handleChange("guarantee", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
}
