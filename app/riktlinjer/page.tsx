import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import ContentBlocks from "@/components/ContentBlocks";
import { getRiktlinjer } from "@/lib/data";

export default async function RiktlinjerPage() {
  const page = await getRiktlinjer();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: "Riktlinjer" }]}
      />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading title={page.title} intro={page.subtitle} />

      <ContentBlocks blocks={page.blocks} />

      {page.footer && (
        <p className="mt-8 whitespace-pre-line border-t border-sand-200 pt-4 text-xs italic text-clay-400">
          {page.footer}
        </p>
      )}
    </div>
  );
}
