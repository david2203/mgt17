import { Fragment } from "react";
import Link from "next/link";

// Renderar text där **text** blir fetstil och [text](/sökväg) blir en länk.
// Interna länkar (börjar med "/") använder Next Link, övriga öppnas i ny flik.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-clay-700">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith("/")) {
            return (
              <Link
                key={i}
                href={href}
                className="font-medium text-forest-700 underline underline-offset-2 hover:text-forest-600"
              >
                {label}
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-forest-700 underline underline-offset-2 hover:text-forest-600"
            >
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
