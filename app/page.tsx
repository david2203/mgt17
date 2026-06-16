import NavCard from "@/components/NavCard";
import PageHeading from "@/components/PageHeading";

export default function HomePage() {
  return (
    <div>
      <PageHeading
        title="Välkommen"
        intro="Välj ett område nedan."
      />
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
        <NavCard
          href="/infor-nasta-mote"
          title="Inför nästa möte"
          description="Ansvarsområden och vem som gör vad."
        />
        <NavCard
          href="/riktlinjer"
          title="Riktlinjer för gruppen"
          description="Principer och rutiner för MGT-fortsättningsgruppen."
        />
      </div>
    </div>
  );
}
