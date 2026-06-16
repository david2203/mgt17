import NavCard from "@/components/NavCard";
import PageHeading from "@/components/PageHeading";
import { getResponsibilities } from "@/lib/data";
import { formatMeetingDate } from "@/lib/format";

export default async function HomePage() {
  const responsibilities = await getResponsibilities();
  const dateText = responsibilities.nextMeetingDate
    ? formatMeetingDate(responsibilities.nextMeetingDate)
    : null;

  return (
    <div>
      <PageHeading title="Välkommen" intro="Välj ett område nedan." />
      <div className="grid gap-4">
        <NavCard
          href="/motesstruktur"
          title="Mötesstruktur"
          description="Så här är ett möte upplagt, steg för steg."
        />
        <NavCard
          href="/processer"
          title="Processväljaren"
          description="Välj en process och se frågorna att ställa."
        />
        <NavCard
          href="/arbetsrunda"
          title="Att leda en arbetsrunda"
          description="Roller, ordning och steg för att hålla i arbetsrundan."
        />
        <div>
          <NavCard
            href="/infor-nasta-mote"
            title="Inför nästa möte"
            description={
              dateText
                ? `Nästa möte: ${dateText}`
                : "Ansvarsområden och vem som gör vad."
            }
          />
          {responsibilities.meetingLink && (
            <a
              href={responsibilities.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:underline"
            >
              <span aria-hidden="true">🎥</span>
              Zoom-länk
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        <NavCard
          href="/riktlinjer"
          title="Riktlinjer för gruppen"
          description="Principer och rutiner för MGT-fortsättningsgruppen."
        />
      </div>
    </div>
  );
}
