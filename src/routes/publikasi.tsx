import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { PaperList } from "@/components/blog/paper-list";
import { fetchPapers } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description =
  "Daftar karya Muhamad Abduh yang sudah tercantum di situs, dengan DOI hanya bila sudah tercatat.";

export const Route = createFileRoute("/publikasi")({
  loader: () => fetchPapers(),
  head: () =>
    pageHead({
      title: "Publikasi — Muhamad Abduh",
      description,
      path: "/publikasi",
      locale: "id_ID",
    }),
  component: PublikasiRoute,
});

function PublikasiRoute() {
  const data = Route.useLoaderData();
  return (
    <SiteShell>
      <PaperList
        heading="Publikasi"
        lede="Karya yang sudah ada di situs. DOI ditampilkan hanya bila sudah tercatat. Kalimat manfaat untuk praktisi dan topik belum diisi di data — bagian itu menyusul, tanpa perkiraan."
        papers={data.papers}
      />
    </SiteShell>
  );
}
