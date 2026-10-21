export type ToolItem = {
  id: string;
  title: string;
  description: string;
  note: string;
  appUrl: string;
  trackId: string;
  /** Slugs from the five fixed topics. Empty until curated. */
  topics: string[];
};

export const tools: ToolItem[];
