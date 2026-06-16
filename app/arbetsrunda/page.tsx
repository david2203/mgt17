import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import ContentBlocks from "@/components/ContentBlocks";
import { getArbetsrunda } from "@/lib/data";

export default async function ArbetsrundaPage() {
  const page = await getArbetsrunda();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: page.title }]}
      />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading title={page.title} intro={page.intro} />

      <ContentBlocks blocks={page.blocks} />

      <div className="mt-8">
        <Link
          href="/processer"
          className="inline-flex items-center gap-2 rounded-md bg-forest-600 px-4 py-2 font-medium text-white hover:bg-forest-700"
        >
          Öppna Processväljaren
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
