// lib/analytics/deriveMetrics.ts

export type SocialMetrics = {
  posts: number;
  followers: number;
  comments: number;
  likes: number;
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

/* -------------------------------------------------- */
/* Basic helpers                                      */
/* -------------------------------------------------- */

export function sumMetrics(list: SocialMetrics[]): SocialMetrics {
  return list.reduce(
    (acc, cur) => ({
      posts: acc.posts + (cur.posts ?? 0),
      followers: acc.followers + (cur.followers ?? 0),
      comments: acc.comments + (cur.comments ?? 0),
      likes: acc.likes + (cur.likes ?? 0),
    }),
    { posts: 0, followers: 0, comments: 0, likes: 0 }
  );
}

export function getLastValue(series: TimeSeriesPoint[]): number {
  if (!series.length) return 0;
  return series[series.length - 1].value;
}

export function getPreviousValue(series: TimeSeriesPoint[]): number {
  if (series.length < 2) return 0;
  return series[series.length - 2].value;
}

/* -------------------------------------------------- */
/* Growth & change                                    */
/* -------------------------------------------------- */

export function getDelta(series: TimeSeriesPoint[]): number {
  const last = getLastValue(series);
  const prev = getPreviousValue(series);
  return last - prev;
}

export function getPercentChange(series: TimeSeriesPoint[]): number {
  const last = getLastValue(series);
  const prev = getPreviousValue(series);

  if (prev === 0) return 0;
  return ((last - prev) / prev) * 100;
}

/* -------------------------------------------------- */
/* Engagement                                         */
/* -------------------------------------------------- */

export function getEngagementRate(metrics: SocialMetrics): number {
  if (metrics.followers === 0) return 0;

  const interactions = (metrics.likes ?? 0) + (metrics.comments ?? 0);
  return (interactions / metrics.followers) * 100;
}

/* -------------------------------------------------- */
/* Scaling helpers (for charts)                       */
/* -------------------------------------------------- */

export function clampValue(value: number, max: number) {
  return Math.min(value, max);
}

export function getMaxFromSeries(series: TimeSeriesPoint[]) {
  return Math.max(...series.map((d) => d.value), 0);
}