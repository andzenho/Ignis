"use client";

import { useEffect, useState } from "react";
import { saveProject } from "@/lib/storage";
import { Expert } from "@/lib/types";
import { useProjectContext } from "@/lib/context/ProjectContext";

type FieldConfig = {
  key: keyof Expert;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: { value: string; label: string }[];
  section: string;
};

const fields: FieldConfig[] = [
  { key: "name", label: "Имя эксперта", section: "Основное", placeholder: "Имя и фамилия" },
  { key: "positioning", label: "Позиционирование", section: "Основное", type: "textarea", placeholder: "Кто вы и чем занимаетесь" },
  { key: "city", label: "Город", section: "Основное", placeholder: "Москва" },
  { key: "yearsInField", label: "Лет в нише", section: "Основное", type: "number" },
  { key: "mainExpertise", label: "Основная экспертиза", section: "Экспертность", type: "textarea" },
  { key: "methodName", label: "Название метода", section: "Экспертность" },
  { key: "methodDescription", label: "Описание метода", section: "Экспертность", type: "textarea" },
  { key: "methodDifference", label: "Чем метод отличается", section: "Экспертность", type: "textarea" },
  { key: "personalResults", label: "Личные результаты", section: "Экспертность", type: "textarea" },
  { key: "achievements", label: "Достижения", section: "Экспертность", type: "textarea" },
  { key: "pivotMoment", label: "Поворотный момент", section: "История", type: "textarea" },
  { key: "backgroundBefore", label: "Фон до ниши", section: "История", type: "textarea" },
  { key: "howCameToNiche", label: "Как пришёл в нишу", section: "История", type: "textarea" },
  { key: "firstFailure", label: "Первый провал", section: "История", type: "textarea" },
  { key: "firstWinMoment", label: "Первая победа", section: "История", type: "textarea" },
  { key: "personalTransformation", label: "Личная трансформация", section: "История", type: "textarea" },
  { key: "nicheMythsBusted", label: "Мифы ниши, которые разрушаю", section: "Позиция", type: "textarea" },
  { key: "nicheInsiderKnowledge", label: "Инсайды ниши", section: "Позиция", type: "textarea" },
  { key: "redLines", label: "Красные линии", section: "Позиция", type: "textarea" },
  { key: "coreBelief", label: "Ключевое убеждение", section: "Позиция", type: "textarea" },
  { key: "publicDisagreements", label: "С чем публично не согласен", section: "Позиция", type: "textarea" },
  { key: "whatAngersYou", label: "Что злит в нише", section: "Позиция", type: "textarea" },
  { key: "lifeValues", label: "Жизненные ценности", section: "Личность", type: "textarea" },
  { key: "dailyRoutine", label: "Распорядок дня", section: "Личность", type: "textarea" },
  {
    key: "familyPublic",
    label: "Семья в публичном поле",
    section: "Личность",
    type: "select",
    options: [
      { value: "yes", label: "Да, открыто" },
      { value: "no", label: "Нет" },
      { value: "partial", label: "Частично" },
    ],
  },
  { key: "hobbies", label: "Хобби", section: "Личность", type: "textarea" },
  { key: "inspirationSources", label: "Источники вдохновения", section: "Личность", type: "textarea" },
  { key: "signatureLifeTopics", label: "Фирменные темы о жизни", section: "Личность", type: "textarea" },
  { key: "audienceNickname", label: "Обращение к аудитории", section: "Аудитория", placeholder: "Например: друзья, марафонцы" },
  {
    key: "relationshipStyle",
    label: "Стиль отношений с аудиторией",
    section: "Аудитория",
    type: "select",
    options: [
      { value: "teacher", label: "Учитель" },
      { value: "friend", label: "Друг" },
      { value: "mentor", label: "Ментор" },
      { value: "partner", label: "Партнёр" },
    ],
  },
  { key: "audienceLovesYouFor", label: "Аудитория любит вас за", section: "Аудитория", type: "textarea" },
  { key: "audienceCritiquesYouFor", label: "Аудитория критикует вас за", section: "Аудитория", type: "textarea" },
  { key: "forbiddenTopics", label: "Запретные темы", section: "Аудитория", type: "textarea" },
];

const sections = ["Основное", "Экспертность", "История", "Позиция", "Личность", "Аудитория"];

export default function ExpertPage({ params }: { params: { id: string } }) {
  const { project, refreshProject } = useProjectContext();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) setExpert({ ...project.expert });
  }, [project?.id]);

  const handleChange = (key: keyof Expert, value: string | number | boolean) => {
    setExpert((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = () => {
    if (!project || !expert) return;
    setSaving(true);
    saveProject({ ...project, expert, updatedAt: new Date().toISOString() });
    refreshProject();
    setTimeout(() => setSaving(false), 600);
  };

  if (!project || !expert) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-50">Эксперт</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "Сохранено ✓" : "Сохранить"}
          </button>
        </div>

        {sections.map((section) => {
          const sectionFields = fields.filter((f) => f.section === section);
          return (
            <div key={section} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                {section}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionFields.map((field) => (
                  <div
                    key={field.key}
                    className={field.type === "textarea" ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={String(expert[field.key] ?? "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={String(expert[field.key] ?? "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        value={Number(expert[field.key] ?? 0)}
                        onChange={(e) => handleChange(field.key, Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(expert[field.key] ?? "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
