import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import { cookies } from "next/headers";
import { getMembers, getResponsibilities } from "@/lib/data";
import { formatSwedishDate } from "@/lib/format";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import {
  buildMembersMailto,
  buildAssignmentRows,
  TABLE_HEADER,
} from "@/lib/mailto";
import CopyTableButton from "@/components/CopyTableButton";

export const dynamic = "force-dynamic";

export default async function NextMeetingPage() {
  const [responsibilities, members] = await Promise.all([
    getResponsibilities(),
    getMembers(),
  ]);

  const session = await verifyToken((await cookies()).get(AUTH_COOKIE)?.value);
  const isAdmin = session?.role === "admin";

  const nameById = new Map(members.map((m) => [m.id, m.name]));

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: "Inför nästa möte" }]}
      />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading
        title="Inför nästa möte"
        intro={
          responsibilities.nextMeetingDate
            ? `Nästa möte: ${formatSwedishDate(responsibilities.nextMeetingDate)}`
            : undefined
        }
      />

      {isAdmin && (
        <div className="mb-6 flex flex-wrap gap-3">
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
      )}

      {responsibilities.meetingLink && (
        <p className="mb-4">
          <a
            href={responsibilities.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-clay-600 px-4 py-2 text-sm font-medium text-white hover:bg-clay-700"
          >
            <span aria-hidden="true">🎥</span>
            Zoom-länk
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      )}

      {responsibilities.nextMeetingNote && (
        <p className="mb-6 rounded-md border border-sand-200 bg-sand-100 px-4 py-3 text-sm text-clay-500">
          {responsibilities.nextMeetingNote}
        </p>
      )}

      <section aria-label="Ansvarsområden">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-clay-400">
          Ansvarsområden
        </h2>
        <div className="grid gap-4">
          {responsibilities.areas.map((area) => {
            const names = area.assignees
              .map((id) => nameById.get(id))
              .filter((n): n is string => Boolean(n));
            const initierare = names[0];
            const med = names.slice(1);
            return (
              <div
                key={area.id}
                className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-lg font-semibold text-clay-700">
                    {area.name}
                  </h3>
                  {area.tid && (
                    <span className="text-sm text-clay-400">{area.tid}</span>
                  )}
                </div>
                {area.description && (
                  <p className="mt-1 text-sm text-clay-500">{area.description}</p>
                )}
                {names.length > 0 ? (
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-clay-400">Initierar</dt>
                      <dd className="font-medium text-clay-700">{initierare}</dd>
                    </div>
                    {med.length > 0 && (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 text-clay-400">Med</dt>
                        <dd className="font-medium text-clay-700">
                          {med.join(", ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="mt-3 text-sm italic text-clay-400">
                    Ingen tilldelad ännu
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
