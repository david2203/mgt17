import Link from "next/link";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 text-sm text-forest-700 hover:underline"
    >
      <span aria-hidden="true" className="text-base">
        ←
      </span>
      {label}
    </Link>
  );
}
