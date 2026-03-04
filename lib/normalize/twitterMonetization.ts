export type TwitterMonetization = {
  eligible: boolean;
  followersProgress: number;
  impressionsProgress: number;
  impressionsNeeded: number;
  daysRemaining: number;
  estimatedEligibilityDate: string | null;
  status: string;
};

export function computeTwitterMonetization(input: {
  followers: number | null;
  impressions90d: number | null;
  windowStart: string | null; // ISO date of the 90-day window start
}): TwitterMonetization {
  const followers = input.followers ?? 0;
  const impressions = input.impressions90d ?? 0;

  const FOLLOWER_THRESHOLD = 500;
  const IMPRESSIONS_THRESHOLD = 5_000_000;
  const WINDOW_DAYS = 90;

  // Followers progress
  const followersProgress = Math.min(
    (followers / FOLLOWER_THRESHOLD) * 100,
    100
  );

  // Impressions progress
  const impressionsProgress = Math.min(
    (impressions / IMPRESSIONS_THRESHOLD) * 100,
    100
  );

  // Impressions needed
  const impressionsNeeded = Math.max(
    IMPRESSIONS_THRESHOLD - impressions,
    0
  );

  // Days remaining in the 90-day window
  let daysRemaining = WINDOW_DAYS;
  let estimatedEligibilityDate: string | null = null;

  if (input.windowStart) {
    const start = new Date(input.windowStart);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(WINDOW_DAYS - daysPassed, 0);

    // Estimate eligibility date if impressions are growing
    if (impressions > 0 && impressions < IMPRESSIONS_THRESHOLD) {
      const dailyRate = impressions / daysPassed;
      if (dailyRate > 0) {
        const daysToGoal = Math.ceil(impressionsNeeded / dailyRate);
        const estimate = new Date(now);
        estimate.setDate(now.getDate() + daysToGoal);
        estimatedEligibilityDate = estimate.toISOString();
      }
    }
  }

  // Eligibility
  const eligible =
    followers >= FOLLOWER_THRESHOLD &&
    impressions >= IMPRESSIONS_THRESHOLD;

  // Status message
  let status = "Not eligible";
  if (eligible) status = "Eligible for monetization";
  else if (followers < FOLLOWER_THRESHOLD)
    status = `Need ${FOLLOWER_THRESHOLD - followers} more followers`;
  else if (impressions < IMPRESSIONS_THRESHOLD)
    status = `Need ${impressionsNeeded.toLocaleString()} more impressions`;

  return {
    eligible,
    followersProgress,
    impressionsProgress,
    impressionsNeeded,
    daysRemaining,
    estimatedEligibilityDate,
    status,
  };
}