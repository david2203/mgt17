"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

// Drivs av formulärets status. Visar:
//  - en fast info-toast (nere till höger) vid osparade ändringar (ingen tidsgräns)
//  - en grön success-toast i 5 sekunder när sparningen är klar
// Kräver inget sidombyte, så sidan scrollar inte till toppen vid sparning.
export default function AdminFormFeedback() {
  const ref = useRef<HTMLDivElement>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  // Markera "osparat" när något ändras i formuläret.
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const markDirty = () => setDirty(true);
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
    };
  }, []);

  // Upptäck när sparningen blivit klar (pending: true -> false).
  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      return;
    }
    if (wasPending.current) {
      wasPending.current = false;
      setDirty(false);
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 5000);
      return () => clearTimeout(t);
    }
  }, [pending]);

  // Varna vid navigering bort med osparade ändringar.
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
      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-3 rounded-lg border border-forest-500 bg-forest-600 px-4 py-3 text-sm text-white shadow-lg"
        >
          <span aria-hidden="true" className="mt-0.5 text-base">
            ✓
          </span>
          <span>Ändringarna har sparats.</span>
        </div>
      )}
      {dirty && !pending && !saved && (
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
