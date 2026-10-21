import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { PaperList } from "@/components/blog/paper-list";
import { fetchPapers } from "@/lib/content/api";
import { pageHead } from "@/lib/seo";

const description =
  "Karya penelitian Muhamad Abduh yang menjadi sumber seri blog. Pertanyaan riset menyusul di data, tidak diisi perkiraan.";

export const Route = createFileRoute("/riset")({
  loader: () => fetchPapers(),
  head: () =>
    pageHead({
      title: "Riset — Muhamad Abduh",
      description,
      path: "/riset",
      locale: "id_ID",
    }),
  component: RisetRoute,
});

function RisetRoute() {
  const data = Route.useLoaderData();
  return (
    <SiteShell>
      <PaperList
        heading="Riset"
        lede="Daftar yang sama dengan halaman publikasi, dipakai blog sebagai sumber. Pertanyaan riset dan manfaat bagi pembaca belum ditulis di data. Studi yang sedang berjalan tetap ada di halaman Research."
        papers={data.papers}
      />
    </SiteShell>
  );
}
