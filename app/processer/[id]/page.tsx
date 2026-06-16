import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import { getProcess, getProcesses } from "@/lib/data";
import type { ProcessSection } from "@/lib/types";
import RichText from "@/components/RichText";

export async function generateStaticParams() {
  const processes = await getProcesses();
  return processes.map((p) => ({ id: p.id }));
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-clay-400">
        {label}
      </h2>
      <p className="mt-1 whitespace-pre-line text-clay-700">
        <RichText text={text} />
      </p>
    </div>
  );
}

function MetaItem({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-clay-400">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-line text-sm text-clay-600">
        <RichText text={text} />
      </dd>
    </div>
  );
}

function Section({ section, index }: { section: ProcessSection; index: number }) {
  return (
    <section
      aria-label={section.title ?? `Avsnitt ${index + 1}`}
      className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
    >
      {section.title && (
        <h2 className="text-lg font-semibold text-clay-700">{section.title}</h2>
      )}
      {section.intro && (
        <p className="mt-2 whitespace-pre-line text-clay-600">
          <RichText text={section.intro} />
        </p>
      )}
      {section.steps && section.steps.length > 0 && (
        <ol className="mt-4 space-y-3">
          {section.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-600 text-xs font-semibold text-white"
              >
                {(section.startNumber ?? 1) + i}
              </span>
              <p className="whitespace-pre-line text-clay-700">
                <RichText text={step} />
              </p>
            </li>
          ))}
        </ol>
      )}
      {section.note && (
        <p className="mt-4 whitespace-pre-line rounded-md bg-sand-100 px-3 py-2 text-sm text-clay-500">
          <RichText text={section.note} />
        </p>
      )}
    </section>
  );
}

export default async function ProcessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const process = await getProcess(id);
  if (!process) notFound();

  const hasMeta = process.intention || process.energi || process.tid;
  const hasSections = process.sections && process.sections.length > 0;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Hem", href: "/" },
          { label: "Processväljaren", href: "/processer" },
          { label: process.name },
        ]}
      />
      <BackLink href="/processer" label="Tillbaka till processerna" />
      <PageHeading title={process.name} />

      <div className="grid gap-4">
        {process.syfte && <InfoBlock label="Syfte" text={process.syfte} />}
        {process.anvandbarNar && (
          <InfoBlock label="Användbar när" text={process.anvandbarNar} />
        )}
        {process.kommentar && (
          <InfoBlock label="Kommentar" text={process.kommentar} />
        )}
      </div>

      {hasMeta && (
        <dl className="mt-4 space-y-4 rounded-xl border border-clay-400/30 bg-sand-100 p-5">
          {process.intention && (
            <MetaItem label="Intention" text={process.intention} />
          )}
          {process.energi && <MetaItem label="Energi" text={process.energi} />}
          {process.tid && <MetaItem label="Tid" text={process.tid} />}
        </dl>
      )}

      <div className="mt-8 space-y-4">
        {hasSections ? (
          process.sections!.map((section, i) => (
            <Section key={i} section={section} index={i} />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-sand-300 bg-sand-50 p-4 text-sm italic text-clay-400">
            Den detaljerade guiden (frågor och upplägg) för den här processen är
            inte tillagd ännu.
          </p>
        )}
      </div>
    </div>
  );
}
