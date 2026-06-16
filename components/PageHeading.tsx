export default function PageHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-clay-700">{title}</h1>
      {intro && <p className="mt-2 text-clay-500">{intro}</p>}
    </div>
  );
}
