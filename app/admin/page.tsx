import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import { getMembers, getResponsibilities } from "@/lib/data";
import AdminForm from "@/components/AdminForm";
import {
  buildMembersMailto,
  buildAssignmentRows,
  TABLE_HEADER,
} from "@/lib/mailto";
import CopyTableButton from "@/components/CopyTableButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [responsibilities, members] = await Promise.all([
    getResponsibilities(),
    getMembers(),
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Hem", href: "/" }, { label: "Admin" }]} />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading
        title="Admin – ansvarsområden"
        intro="Tilldela medlemmar till varje ansvarsområde inför nästa möte."
      />

      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <a
            href={buildMembersMailto(members, responsibilities)}
            className="inline-flex items-center gap-2 rounded-md border border-forest-600 px-4 py-2 text-sm font-medium text-forest-700 hover:bg-forest-600 hover:text-white"
          >
            <span aria-hidden="true">✉</span>
            Maila medlemmar
          </a>
          <CopyTableButton
            header={TABLE_HEADER}
            rows={buildAssignmentRows(members, responsibilities)}
          />
        </div>
        <p className="mt-1 text-xs text-clay-400">
          &quot;Maila medlemmar&quot; öppnar mejlet med en text-tabell. För en
          riktig tabell: klicka &quot;Kopiera tabell&quot; och klistra in
          (Cmd/Ctrl+V) i mejlet. Reflekterar sparade ändringar – spara först.
        </p>
      </div>

      <AdminForm members={members} responsibilities={responsibilities} />
    </div>
  );
}
