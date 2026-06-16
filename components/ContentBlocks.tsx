import type { ContentBlock } from "@/lib/types";
import RichText from "@/components/RichText";

export default function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="border-b border-sand-200 pb-1 pt-2 text-lg font-semibold text-clay-700"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3 key={i} className="text-base font-semibold text-clay-700">
              {block.text}
            </h3>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={i} className="whitespace-pre-line text-clay-600">
              <RichText text={block.text} />
            </p>
          );
        }
        // list
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <div
            key={i}
            className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
          >
            {block.title && (
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-clay-400">
                {block.title}
              </h3>
            )}
            <ListTag
              className={
                block.ordered
                  ? "list-decimal space-y-2 pl-5 text-clay-700 marker:text-clay-400"
                  : "space-y-2 text-clay-700"
              }
            >
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className={
                    block.ordered
                      ? "whitespace-pre-line pl-1"
                      : "flex items-start gap-2 whitespace-pre-line"
                  }
                >
                  {!block.ordered && (
                    <span aria-hidden="true" className="mt-1 text-forest-600">
                      •
                    </span>
                  )}
                  <span>
                    <RichText text={item} />
                  </span>
                </li>
              ))}
            </ListTag>
          </div>
        );
      })}
    </div>
  );
}
