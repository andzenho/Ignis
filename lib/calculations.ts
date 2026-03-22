import { FunnelStep, Funnel } from "./types";

export interface ConversionResult {
  stepId: string;
  conversion: number | null;
}

/**
 * Calculate step-to-step conversion rates based on fact values.
 * First step has null conversion (no previous step to compare).
 */
export function calcFunnelConversions(steps: FunnelStep[]): ConversionResult[] {
  return steps.map((step, index) => {
    if (index === 0) {
      return { stepId: step.id, conversion: null };
    }
    const prev = steps[index - 1];
    if (prev.fact === 0) {
      return { stepId: step.id, conversion: null };
    }
    const conversion = (step.fact / prev.fact) * 100;
    return { stepId: step.id, conversion: Math.round(conversion * 10) / 10 };
  });
}

/**
 * Calculate total planned and actual revenue across all funnels.
 * Revenue = last funnel step (sales) * price.
 */
export function calcTotalRevenue(
  funnels: Funnel[],
  price: number
): { plan: number; fact: number } {
  let plan = 0;
  let fact = 0;

  for (const funnel of funnels) {
    if (funnel.steps.length === 0) continue;
    const lastStep = funnel.steps[funnel.steps.length - 1];
    plan += lastStep.plan * price;
    fact += lastStep.fact * price;
  }

  return { plan, fact };
}

/**
 * Calculate revenue gap: positive means behind plan, negative means ahead.
 */
export function calcGap(targetRevenue: number, factRevenue: number): number {
  return targetRevenue - factRevenue;
}

/**
 * Find the UTM source label that drove the most entries (first step fact).
 */
export function calcBestSource(funnels: Funnel[]): string {
  const sourceTotals: Record<string, number> = {};

  for (const funnel of funnels) {
    if (funnel.steps.length === 0) continue;
    const firstStep = funnel.steps[0];

    for (const source of funnel.utm.sources) {
      const key = source.label || source.utmSource;
      if (!key) continue;
      sourceTotals[key] = (sourceTotals[key] ?? 0) + firstStep.fact;
    }
  }

  let bestSource = "";
  let bestCount = 0;

  for (const [source, count] of Object.entries(sourceTotals)) {
    if (count > bestCount) {
      bestCount = count;
      bestSource = source;
    }
  }

  return bestSource;
}
