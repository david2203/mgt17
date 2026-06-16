"use client";

import { useState } from "react";

// Kontrollerade fält (datum/notering/länk) så att de inte nollställs av
// React:s automatiska formulärreset efter en server action.
export default function MeetingFields({
  date,
  note,
  link,
  onDirty,
}: {
  date: string;
  note: string;
  link: string;
  onDirty?: () => void;
}) {
  const [d, setD] = useState(date);
  const [n, setN] = useState(note);
  const [l, setL] = useState(link);

  return (
    <div className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nextMeetingDate"
            className="block text-sm font-medium text-clay-600"
          >
            Datum för nästa möte
          </label>
          <input
            id="nextMeetingDate"
            name="nextMeetingDate"
            type="date"
            value={d}
            onChange={(e) => {
              setD(e.target.value);
              onDirty?.();
            }}
            className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
          />
        </div>
        <div>
          <label
            htmlFor="nextMeetingNote"
            className="block text-sm font-medium text-clay-600"
          >
            Notering (valfritt)
          </label>
          <input
            id="nextMeetingNote"
            name="nextMeetingNote"
            type="text"
            value={n}
            onChange={(e) => {
              setN(e.target.value);
              onDirty?.();
            }}
            placeholder="T.ex. tema"
            className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="meetingLink"
            className="block text-sm font-medium text-clay-600"
          >
            Länk till plats (valfritt)
          </label>
          <input
            id="meetingLink"
            name="meetingLink"
            type="url"
            value={l}
            onChange={(e) => {
              setL(e.target.value);
              onDirty?.();
            }}
            placeholder="https://… (Zoom, karta, adress m.m.)"
            className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
          />
          <p className="mt-1 text-xs text-clay-400">
            Var nästa möte sker – t.ex. en Zoom-länk eller en länk till en karta.
          </p>
        </div>
      </div>
    </div>
  );
}
