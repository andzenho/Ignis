import { UTMSource, UTMConfig } from "./types";
import { nanoid } from "./storage";

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
  А: "a", Б: "b", В: "v", Г: "g", Д: "d", Е: "e", Ё: "yo", Ж: "zh",
  З: "z", И: "i", Й: "y", К: "k", Л: "l", М: "m", Н: "n", О: "o",
  П: "p", Р: "r", С: "s", Т: "t", У: "u", Ф: "f", Х: "kh", Ц: "ts",
  Ч: "ch", Ш: "sh", Щ: "shch", Ъ: "", Ы: "y", Ь: "", Э: "e", Ю: "yu",
  Я: "ya",
};

export function toSlug(text: string): string {
  return text
    .split("")
    .map((char) => TRANSLIT_MAP[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function generateUTMUrl(
  baseUrl: string,
  source: UTMSource,
  config: UTMConfig
): string {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    if (config.campaign) url.searchParams.set("utm_campaign", config.campaignSlug || toSlug(config.campaign));
    if (config.medium) url.searchParams.set("utm_medium", config.medium);
    if (source.utmSource) url.searchParams.set("utm_source", source.utmSource);
    if (source.utmContent) url.searchParams.set("utm_content", source.utmContent);
    return url.toString();
  } catch {
    // fallback for invalid URLs
    const params = new URLSearchParams();
    if (config.campaign) params.set("utm_campaign", config.campaignSlug || toSlug(config.campaign));
    if (config.medium) params.set("utm_medium", config.medium);
    if (source.utmSource) params.set("utm_source", source.utmSource);
    if (source.utmContent) params.set("utm_content", source.utmContent);
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }
}

const BASE_SOURCES: Omit<UTMSource, "id">[] = [
  {
    label: "ТГ основной канал",
    utmSource: "tg_main",
    utmContent: "post",
    hint: "Вставить в пост с ссылкой в основном канале",
  },
  {
    label: "Instagram Stories",
    utmSource: "ig",
    utmContent: "stories",
    hint: "Стикер-ссылка в сторис",
  },
  {
    label: "Instagram Reels",
    utmSource: "ig",
    utmContent: "reels",
    hint: "Ссылка в описании Reels",
  },
  {
    label: "Instagram Bio",
    utmSource: "ig",
    utmContent: "bio",
    hint: "Ссылка в шапке профиля",
  },
  {
    label: "Telegram Ads",
    utmSource: "tg_ads",
    utmContent: "ad",
    hint: "В объявление Telegram Ads",
  },
  {
    label: "ТГ рассылка (бот)",
    utmSource: "tg_bot",
    utmContent: "broadcast",
    hint: "В сообщение бота-рассылки",
  },
  {
    label: "Закрытый ТГ-канал",
    utmSource: "tg_closed",
    utmContent: "pinned",
    hint: "В закреп закрытого канала",
  },
];

export function getDefaultSources(templateId: string): UTMSource[] {
  return BASE_SOURCES.map((s) => ({ ...s, id: nanoid() }));
}
