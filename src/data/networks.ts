/**
 * Professional / learning networks — websites and channels.
 * Add new entries here; they appear on the Networks section.
 */
export type NetworkItem = {
  name: string;
  /** Short label under the name */
  kind: "society" | "forum" | "campus" | "media" | "other";
  description: string;
  website?: string;
  youtube?: string;
};

export const networks: NetworkItem[] = [
  {
    name: "ICF — Indonesia Construction Forum",
    kind: "forum",
    description:
      "A forum for conversation and learning on construction in Indonesia — talks, sharing, and community discussion.",
    youtube: "https://www.youtube.com/channel/UCmmnEvQEG2t5jtNQaasa4Sg",
  },
];
