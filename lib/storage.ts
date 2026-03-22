import { Project, Launch, Funnel, Expert, Product, Audience } from "./types";

const STORAGE_KEY = "ignis_projects";

export function nanoid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getProjects(): Project[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): void {
  if (!isClient()) return;
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  if (!isClient()) return;
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getLaunch(projectId: string, launchId: string): Launch | null {
  const project = getProject(projectId);
  if (!project) return null;
  return project.launches.find((l) => l.id === launchId) ?? null;
}

export function saveLaunch(projectId: string, launch: Launch): void {
  const project = getProject(projectId);
  if (!project) return;
  const index = project.launches.findIndex((l) => l.id === launch.id);
  if (index >= 0) {
    project.launches[index] = launch;
  } else {
    project.launches.push(launch);
  }
  project.updatedAt = new Date().toISOString();
  saveProject(project);
}

export function getFunnel(
  projectId: string,
  launchId: string,
  funnelId: string
): Funnel | null {
  const launch = getLaunch(projectId, launchId);
  if (!launch) return null;
  return launch.funnels.find((f) => f.id === funnelId) ?? null;
}

export function saveFunnel(
  projectId: string,
  launchId: string,
  funnel: Funnel
): void {
  const project = getProject(projectId);
  if (!project) return;
  const launchIndex = project.launches.findIndex((l) => l.id === launchId);
  if (launchIndex < 0) return;

  const funnelIndex = project.launches[launchIndex].funnels.findIndex(
    (f) => f.id === funnel.id
  );
  if (funnelIndex >= 0) {
    project.launches[launchIndex].funnels[funnelIndex] = funnel;
  } else {
    project.launches[launchIndex].funnels.push(funnel);
  }
  project.updatedAt = new Date().toISOString();
  saveProject(project);
}

export function createEmptyExpert(): Expert {
  return {
    name: "",
    positioning: "",
    city: "",
    pivotMoment: "",
    backgroundBefore: "",
    howCameToNiche: "",
    firstFailure: "",
    firstWinMoment: "",
    personalTransformation: "",
    mainExpertise: "",
    methodName: "",
    methodDescription: "",
    methodDifference: "",
    personalResults: "",
    yearsInField: 0,
    achievements: "",
    nicheMythsBusted: "",
    nicheInsiderKnowledge: "",
    redLines: "",
    coreBelief: "",
    publicDisagreements: "",
    whatAngersYou: "",
    lifeValues: "",
    dailyRoutine: "",
    familyPublic: "no",
    hobbies: "",
    travel: false,
    inspirationSources: "",
    signatureLifeTopics: "",
    audienceNickname: "",
    relationshipStyle: "mentor",
    audienceLovesYouFor: "",
    audienceCritiquesYouFor: "",
    forbiddenTopics: "",
  };
}

export function createEmptyProduct(): Product {
  return {
    name: "",
    format: "course",
    duration: "",
    mainResult: "",
    afterResult: "",
    idealStudent: "",
    notFor: "",
    mainPain: "",
    transformationA: "",
    transformationB: "",
    costOfInaction: "",
    cases: [],
    objections: [],
    uniqueAdvantage: "",
    vsCompetitors: "",
    price: 0,
    currency: "RUB",
    hasInstallment: false,
    installmentDetails: "",
    spotsLimit: null,
    launchDate: "",
    earlyBirdBonus: "",
    modules: [],
    mostValuablePart: "",
    secretIngredient: "",
    supportFormat: "",
    guarantee: "",
  };
}

export function createEmptyAudience(): Audience {
  return {
    archetypes: [],
    pains: [],
    fears: [],
    objections: [],
  };
}

export function createEmptyProject(): Project {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name: "",
    createdAt: now,
    updatedAt: now,
    expert: createEmptyExpert(),
    product: createEmptyProduct(),
    audience: createEmptyAudience(),
    launches: [],
  };
}

export function createEmptyFunnel(): Funnel {
  return {
    id: nanoid(),
    name: "",
    templateId: "custom",
    baseUrl: "",
    utm: {
      campaign: "",
      campaignSlug: "",
      medium: "social",
      sources: [],
    },
    steps: [],
    dailyLogs: [],
  };
}

export function createEmptyLaunch(number: number): Launch {
  return {
    id: nanoid(),
    number,
    name: `Запуск #${number}`,
    createdAt: new Date().toISOString(),
    status: "planning",
    warmupStartDate: "",
    salesStartDate: "",
    strategy: { salesWindows: [] },
    funnels: [],
    calendar: [],
  };
}
