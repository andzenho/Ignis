export interface Expert {
  name: string;
  positioning: string;
  city: string;
  pivotMoment: string;
  backgroundBefore: string;
  howCameToNiche: string;
  firstFailure: string;
  firstWinMoment: string;
  personalTransformation: string;
  mainExpertise: string;
  methodName: string;
  methodDescription: string;
  methodDifference: string;
  personalResults: string;
  yearsInField: number;
  achievements: string;
  nicheMythsBusted: string;
  nicheInsiderKnowledge: string;
  redLines: string;
  coreBelief: string;
  publicDisagreements: string;
  whatAngersYou: string;
  lifeValues: string;
  dailyRoutine: string;
  familyPublic: "yes" | "no" | "partial";
  hobbies: string;
  travel: boolean;
  inspirationSources: string;
  signatureLifeTopics: string;
  audienceNickname: string;
  relationshipStyle: "teacher" | "friend" | "mentor" | "partner";
  audienceLovesYouFor: string;
  audienceCritiquesYouFor: string;
  forbiddenTopics: string;
}

export interface ProductCase {
  id: string;
  studentName: string;
  startingPoint: string;
  result: string;
  timeframe: string;
  quote: string;
}

export interface Objection {
  id: string;
  text: string;
  answer: string;
}

export interface Product {
  name: string;
  format: "course" | "mentoring" | "group" | "intensive" | "marathon" | "other";
  duration: string;
  mainResult: string;
  afterResult: string;
  idealStudent: string;
  notFor: string;
  mainPain: string;
  transformationA: string;
  transformationB: string;
  costOfInaction: string;
  cases: ProductCase[];
  objections: Objection[];
  uniqueAdvantage: string;
  vsCompetitors: string;
  price: number;
  currency: "RUB" | "USD" | "EUR";
  hasInstallment: boolean;
  installmentDetails: string;
  spotsLimit: number | null;
  launchDate: string;
  earlyBirdBonus: string;
  modules: string[];
  mostValuablePart: string;
  secretIngredient: string;
  supportFormat: string;
  guarantee: string;
}

export interface Archetype {
  id: string;
  name: string;
  age: string;
  description: string;
  mainPain: string;
  mainFear: string;
}

export interface Audience {
  archetypes: Archetype[];
  pains: string[];
  fears: string[];
  objections: string[];
}

export interface UTMSource {
  id: string;
  label: string;
  utmSource: string;
  utmContent: string;
  hint: string;
}

export interface UTMConfig {
  campaign: string;
  campaignSlug: string;
  medium: string;
  sources: UTMSource[];
}

export interface FunnelStep {
  id: string;
  name: string;
  order: number;
  plan: number;
  fact: number;
}

export interface DailyPost {
  id: string;
  platform: "tg_main" | "tg_anketa" | "tg_event" | "ig_reels" | "ig_stories" | "ig_post";
  topic: string;
  reach: number;
  reactions: number;
}

export interface DailyLog {
  id: string;
  date: string;
  notes: string;
  mood: "good" | "ok" | "bad";
  posts: DailyPost[];
}

export interface Funnel {
  id: string;
  name: string;
  templateId: "anketa" | "webinar" | "marathon" | "direct" | "custom";
  baseUrl: string;
  utm: UTMConfig;
  steps: FunnelStep[];
  dailyLogs: DailyLog[];
}

export interface CalendarPost {
  id: string;
  date: string;
  platform: "tg_main" | "tg_anketa" | "tg_event" | "ig_reels" | "ig_stories" | "ig_post";
  format: string;
  topic: string;
  warmupLevel: 1 | 2 | 3 | 4;
  status: "idea" | "ready" | "published";
  actualReach: number;
  reactions: number;
  notes: string;
}

export interface SalesWindowStep {
  id: string;
  type:
    | "warmup"
    | "anketa"
    | "bot"
    | "landing"
    | "closed_tg"
    | "closed_stream"
    | "marathon"
    | "webinar"
    | "sales_open";
  label: string;
  durationDays: number;
  notes: string;
}

export interface SalesWindow {
  id: string;
  templateId: "anketa" | "webinar" | "marathon" | "direct" | "custom";
  name: string;
  steps: SalesWindowStep[];
}

export interface LaunchStrategy {
  salesWindows: SalesWindow[];
}

export interface Launch {
  id: string;
  number: number;
  name: string;
  createdAt: string;
  status: "planning" | "active" | "completed";
  warmupStartDate: string;
  salesStartDate: string;
  strategy: LaunchStrategy;
  funnels: Funnel[];
  calendar: CalendarPost[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  expert: Expert;
  product: Product;
  audience: Audience;
  launches: Launch[];
}
