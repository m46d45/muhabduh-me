/** Five fixed topics for the blog, topic pages, and publication tags. */
export const TOPICS = [
  {
    slug: "lean",
    name: "Lean",
    blurb: "Aliran kerja dan praktik lean di proyek.",
  },
  {
    slug: "rantai-pasok",
    name: "Rantai Pasok",
    blurb: "Material, biaya, dan aliran pasok konstruksi.",
  },
  {
    slug: "pengadaan-berkelanjutan",
    name: "Pengadaan Berkelanjutan",
    blurb: "Membeli dengan memperhitungkan dampak yang lebih panjang.",
  },
  {
    slug: "ketahanan-bencana",
    name: "Ketahanan Bencana",
    blurb: "Kesiapan infrastruktur menghadapi bencana.",
  },
  {
    slug: "pendidikan",
    name: "Pendidikan",
    blurb: "Pembelajaran konstruksi, dari kelas sampai simulasi.",
  },
];

export const TOPIC_SLUGS = TOPICS.map((topic) => topic.slug);
