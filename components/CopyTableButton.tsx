"use client";

import { useState } from "react";

export default function CopyTableButton({
  header,
  rows,
  caption,
}: {
  header: string[];
  rows: string[][];
  caption?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  function buildHtml(): string {
    const esc = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const th = header
      .map(
        (h) =>
          `<th style="border:1px solid #ccc;padding:6px 10px;text-align:left;background:#f3eee4;">${esc(
            h,
          )}</th>`,
      )
      .join("");
    const body = rows
      .map(
        (row) =>
          "<tr>" +
          row
            .map(
              (c) =>
                `<td style="border:1px solid #ccc;padding:6px 10px;">${esc(
                  c,
                )}</td>`,
            )
            .join("") +
          "</tr>",
      )
      .join("");
    const cap = caption
      ? `<p style="margin:0 0 8px;">${esc(caption)}</p>`
      : "";
    return `${cap}<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function buildText(): string {
    const widths = header.map((h, i) =>
      Math.max(h.length, ...rows.map((row) => row[i].length)),
    );
    const fmt = (cells: string[]) =>
      cells.map((c, i) => c.padEnd(widths[i])).join("  |  ");
    const divider = widths.map((w) => "-".repeat(w)).join("--+--");
    const lines = [fmt(header), divider, ...rows.map(fmt)];
    return (caption ? caption + "\n\n" : "") + lines.join("\n");
  }

  async function copy() {
    const html = buildHtml();
    const text = buildText();
    try {
      if (
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard &&
        "write" in navigator.clipboard
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-md border border-forest-600 px-4 py-2 text-sm font-medium text-forest-700 hover:bg-forest-600 hover:text-white"
    >
      <span aria-hidden="true">⧉</span>
      {status === "copied"
        ? "Tabell kopierad!"
        : status === "error"
          ? "Kunde inte kopiera"
          : "Kopiera tabell"}
    </button>
  );
}
