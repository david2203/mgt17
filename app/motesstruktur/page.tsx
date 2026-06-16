import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import { getMeetingStructure } from "@/lib/data";
import RichText from "@/components/RichText";

export default async function MeetingStructurePage() {
  const structure = await getMeetingStructure();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: "Mötesstruktur" }]}
      />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading title={structure.title} intro={structure.intro} />

      {structure.agreements && (
        <section
          aria-label={structure.agreements.title ?? "Överenskommelser"}
          className="mb-8 rounded-xl border border-clay-400/30 bg-sand-100 p-5"
        >
          <h2 className="text-lg font-semibold text-clay-700">
            {structure.agreements.title ?? "Överenskommelser"}
          </h2>
          {structure.agreements.intro && (
            <p className="mt-1 text-sm text-clay-500">
              {structure.agreements.intro}
            </p>
          )}
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-clay-700 marker:text-clay-400">
            {structure.agreements.items.map((item, i) => (
              <li key={i} className="pl-1">
                <RichText text={item} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-clay-400">
        Rundorna
      </h2>
      <ol className="space-y-4">
        {structure.steps.map((step, i) => (
          <li
            key={i}
            className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-semibold text-white"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-lg font-semibold text-clay-700">
                    {step.title}
                  </h3>
                  {step.duration && (
                    <span className="text-sm text-clay-400">{step.duration}</span>
                  )}
                </div>
                {step.description && (
                  <p className="mt-1 whitespace-pre-line text-clay-600">
                    <RichText text={step.description} />
                  </p>
                )}
                {step.substeps && step.substeps.length > 0 && (
                  <ol className="mt-3 space-y-2">
                    {step.substeps.map((sub, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand-200 text-xs font-semibold text-clay-600"
                        >
                          {String.fromCharCode(97 + j)}
                        </span>
                        <p className="whitespace-pre-line text-clay-700">
                          <RichText text={sub} />
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
