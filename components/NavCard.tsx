import Link from "next/link";

export default function NavCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition hover:border-clay-400 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-clay-700 group-hover:text-forest-700">
          {title}
        </h2>
        <span
          aria-hidden="true"
          className="text-clay-400 transition group-hover:translate-x-1 group-hover:text-forest-700"
        >
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-clay-500">{description}</p>
    </Link>
  );
}
