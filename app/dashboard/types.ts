// app/dashboard/types.ts
export type MetricKey =
  | "commentsToday"
  | "commentsWeek"
  | "commentsMonth"
  | "streak"
  | "momentum"
  | string; // allow future metrics

export type MetricUnit = "hours" | "minutes" | "count" | "percent";

export type MetricConfig = {
  key: MetricKey;
  label: string;
  value: number;               // <-- always numeric for charts
  description: string;
  unit?: MetricUnit;           // <-- NEW
  social?: string;             // <-- NEW (for social picker)
  rangeLabel?: string;         // <-- NEW (for share button)
  userId?: string;             // optional for radar
};