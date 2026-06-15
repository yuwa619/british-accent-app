export type BillingPlan = "free" | "pro";

export type UsageLimits = {
  recordingsPerDay: number;
  analysesPerDay: number;
  roleplaySessionsPerWeek: number;
  feedbackHistoryDays: number;
};

export const usageLimits: Record<BillingPlan, UsageLimits> = {
  free: {
    recordingsPerDay: 5,
    analysesPerDay: 3,
    roleplaySessionsPerWeek: 2,
    feedbackHistoryDays: 30,
  },
  pro: {
    recordingsPerDay: 40,
    analysesPerDay: 25,
    roleplaySessionsPerWeek: 20,
    feedbackHistoryDays: 365,
  },
};

export function getUsageLimits(plan: BillingPlan = "free") {
  return usageLimits[plan];
}

export function getUsageLimitSummary(plan: BillingPlan = "free") {
  const limits = getUsageLimits(plan);

  return [
    `${limits.recordingsPerDay} recordings per day`,
    `${limits.analysesPerDay} analyses per day`,
    `${limits.roleplaySessionsPerWeek} roleplay sessions per week`,
    `${limits.feedbackHistoryDays} days of feedback history`,
  ];
}
