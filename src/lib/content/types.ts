export type TopicCard = {
  slug: string;
  name: string;
  blurb: string;
  postCount: number;
};

export type PostCard = {
  slug: string;
  title: string;
  description: string;
  date: string;
  topics: string[];
  draft?: boolean;
  /** Square illustration under public/, or null when the post has none. */
  image?: string | null;
};

export type BlogLink = {
  slug: string;
  title: string;
};
