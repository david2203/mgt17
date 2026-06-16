"use client";

import { useEffect, useRef, useState } from "react";

// Visar en fast info-toast nere till höger när formuläret har osparade
// ändringar (ingen tidsgräns) och varnar vid navigering bort från sidan.
export default function UnsavedChangesWarner() {
  const ref = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const markDirty = () => setDirty(true);
    const markClean = () => setDirty(false);
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", markClean);
    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", markClean);
    };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <div ref={ref}>
      {dirty && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg"
        >
          <span aria-hidden="true" className="mt-0.5 text-base">
            ⚠
          </span>
          <span>
            Osparade ändringar. Klicka på &quot;Spara ändringar&quot; för att
            spara.
          </span>
        </div>
      )}
    </div>
  );
}
