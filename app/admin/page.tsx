import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import { getMembers, getResponsibilities } from "@/lib/data";
import { updateResponsibilities } from "@/lib/actions";
import AssignmentEditor from "@/components/AssignmentEditor";
import {
  buildMembersMailto,
  buildAssignmentRows,
  TABLE_HEADER,
} from "@/lib/mailto";
import CopyTableButton from "@/components/CopyTableButton";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ sparat?: string }>;
}) {
  const params = await searchParams;
  const saved = params.sparat === "1";

  const [responsibilities, members] = await Promise.all([
    getResponsibilities(),
    getMembers(),
  ]);

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: "Admin" }]}
      />
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
            caption={
              responsibilities.nextMeetingDate
                ? `Ansvarsområden inför nästa möte ${responsibilities.nextMeetingDate}`
                : "Ansvarsområden inför nästa möte"
            }
          />
        </div>
        <p className="mt-1 text-xs text-clay-400">
          "Maila medlemmar" öppnar mejlet med en text-tabell. För en riktig tabell: klicka "Kopiera tabell" och klistra in (Cmd/Ctrl+V) i mejlet. Reflekterar sparade ändringar – spara först.
        </p>
      </div>

      {saved && (
        <p
          role="status"
          className="mb-6 rounded-md border border-forest-500 bg-forest-500/10 px-4 py-3 text-sm text-forest-700"
        >
          Ändringarna har sparats.
        </p>
      )}

      <form action={updateResponsibilities} className="space-y-8">
        <div className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nextMeetingDate"
                className="block text-sm font-medium text-clay-600"
              >
                Datum för nästa möte
              </label>
              <input
                id="nextMeetingDate"
                name="nextMeetingDate"
                type="date"
                defaultValue={responsibilities.nextMeetingDate}
                className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
              />
            </div>
            <div>
              <label
                htmlFor="nextMeetingNote"
                className="block text-sm font-medium text-clay-600"
              >
                Notering (valfritt)
              </label>
              <input
                id="nextMeetingNote"
                name="nextMeetingNote"
                type="text"
                defaultValue={responsibilities.nextMeetingNote ?? ""}
                placeholder="T.ex. tema"
                className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="meetingLink"
                className="block text-sm font-medium text-clay-600"
              >
                Länk till plats (valfritt)
              </label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                defaultValue={responsibilities.meetingLink ?? ""}
                placeholder="https://… (Zoom, karta, adress m.m.)"
                className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
              />
              <p className="mt-1 text-xs text-clay-400">
                Var nästa möte sker – t.ex. en Zoom-länk eller en länk till en karta.
              </p>
            </div>
          </div>
        </div>

        <AssignmentEditor members={members} areas={responsibilities.areas} />
        <p className="text-sm text-clay-400">
          En medlem som valts för ett område kan inte väljas i ett annat.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-md bg-forest-600 px-5 py-2.5 font-medium text-white hover:bg-forest-700"
          >
            Spara ändringar
          </button>
          <a
            href="/infor-nasta-mote"
            className="text-sm text-forest-700 hover:underline"
          >
            Visa hur det ser ut för medlemmar
          </a>
        </div>
      </form>
    </div>
  );
}
