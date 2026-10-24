import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { PaperList } from "@/components/blog/paper-list";
import { fetchPapers } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description =
  "Karya Muhamad Abduh yang sudah terverifikasi: DOI cocok, tercatat di ORCID, atau buku yang sudah ada di situs.";

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
        lede="Yang tampil di sini sudah terverifikasi: DOI-nya dicocokkan, tercatat di ORCID, atau berupa buku yang sudah ada di situs. Entri yang belum terverifikasi tetap ada di berkas data, tetapi tidak ditampilkan. Judul dan DOI tidak diubah."
        papers={data.papers}
      />
    </SiteShell>
  );
}
