import { fetchYouTubeMetrics } from "./platforms/youtube";
import { fetchInstagramMetrics } from "./platforms/instagram";

// Accept ANY function signature, no any, no unknown, no errors.
export type IngestionFn = (...args: never[]) => Promise<unknown>;

const registry = {
  youtube: fetchYouTubeMetrics,
  instagram: fetchInstagramMetrics,
};

// Fully typed, no circular reference, no satisfies recursion
export const ingestionRegistry: { [K in keyof typeof registry]: IngestionFn } =
  registry;

export type PlatformKey = keyof typeof registry;