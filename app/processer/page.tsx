import Breadcrumbs from "@/components/Breadcrumbs";
import BackLink from "@/components/BackLink";
import PageHeading from "@/components/PageHeading";
import NavCard from "@/components/NavCard";
import { getProcesses } from "@/lib/data";

export default async function ProcessesPage() {
  const processes = await getProcesses();

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Hem", href: "/" }, { label: "Processväljaren" }]}
      />
      <BackLink href="/" label="Tillbaka till start" />
      <PageHeading
        title="Processväljaren"
        intro="Välj en process för att se frågorna att ställa."
      />

      {processes.length === 0 ? (
        <p className="text-clay-500">Inga processer tillagda ännu.</p>
      ) : (
        <div className="grid gap-4">
          {processes.map((p) => (
            <NavCard
              key={p.id}
              href={`/processer/${p.id}`}
              title={p.name}
              description={p.syfte ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
