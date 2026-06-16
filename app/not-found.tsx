import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-semibold text-clay-700">Sidan hittades inte</h1>
      <p className="mt-2 text-clay-500">
        Sidan du letar efter finns inte.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-forest-600 px-4 py-2 font-medium text-white hover:bg-forest-700"
      >
        Till startsidan
      </Link>
    </div>
  );
}
