/**
 * Professional / learning networks — websites and channels.
 * Add new entries here; they appear on the Networks section.
 */
export type NetworkItem = {
  name: string;
  /** Short label under the name */
  kind: "society" | "forum" | "campus" | "media" | "accreditation" | "collaboration" | "other";
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
  {
    name: "IABEE — Indonesian Accreditation Board for Engineering Education",
    kind: "accreditation",
    description:
      "The national body for accreditation of engineering education programmes in Indonesia — quality assurance for engineering schools.",
    website: "https://iabee.or.id/",
  },
  {
    name: "Forum Akademik Konstruksi Ramping",
    kind: "forum",
    description:
      "An academic forum on lean construction (konstruksi ramping) — shared notes and discussion for educators and researchers.",
    website: "https://sway.cloud.microsoft/CvGD78y1dQLICPSU?ref=Link",
  },
  {
    name: "IA-CRC — Indonesia–Australia Collaborative Research in Construction",
    kind: "collaboration",
    description:
      "A collaborative research network linking Indonesian and Australian colleagues on construction topics.",
    website: "https://sway.cloud.microsoft/k5tRy7iEV1wXrlKu?ref=Link",
  },
];
