"use client";

import { useEffect, useState, useTransition } from "react";
import MeetingFields from "@/components/MeetingFields";
import AssignmentEditor from "@/components/AssignmentEditor";
import { updateResponsibilities } from "@/lib/actions";
import type { Member, Responsibilities } from "@/lib/types";

// Hela admin-formuläret som klientkomponent. Vi hanterar submit manuellt med
// preventDefault och anropar server-actionen direkt, så React aldrig
// nollställer formuläret (vilket annars tömmer de kontrollerade väljarna).
export default function AdminForm({
  members,
  responsibilities,
}: {
  members: Member[];
  responsibilities: Responsibilities;
}) {
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateResponsibilities(formData);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    });
  }

  // Markera osparat och dölj ev. kvarvarande sparat-bekräftelse direkt.
  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

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
    <form onSubmit={onSubmit} className="space-y-8">
      <MeetingFields
        date={responsibilities.nextMeetingDate}
        note={responsibilities.nextMeetingNote ?? ""}
        link={responsibilities.meetingLink ?? ""}
        onDirty={markDirty}
      />

      <AssignmentEditor
        members={members}
        areas={responsibilities.areas}
        onDirty={markDirty}
      />
      <p className="text-sm text-clay-400">
        En medlem som valts för ett område kan inte väljas i ett annat.
      </p>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-forest-600 px-5 py-2.5 font-medium text-white hover:bg-forest-700 disabled:opacity-60"
        >
          {isPending ? "Sparar…" : "Spara ändringar"}
        </button>
        <a
          href="/infor-nasta-mote"
          className="text-sm text-forest-700 hover:underline"
        >
          Visa hur det ser ut för medlemmar
        </a>
      </div>

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
      {dirty && !isPending && !saved && (
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
    </form>
  );
}
