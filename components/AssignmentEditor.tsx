"use client";

import { useState } from "react";
import type { Member, ResponsibilityArea } from "@/lib/types";

const ROLES = ["Initierar", "Tillsammans med"];

export default function AssignmentEditor({
  members,
  areas,
}: {
  members: Member[];
  areas: ResponsibilityArea[];
}) {
  // För varje område: [initierare, med] som member-id eller "".
  function buildInitial(): Record<string, string[]> {
    const init: Record<string, string[]> = {};
    for (const a of areas) {
      init[a.id] = [a.assignees?.[0] ?? "", a.assignees?.[1] ?? ""];
    }
    return init;
  }

  const [sel, setSel] = useState<Record<string, string[]>>(buildInitial);

  // Alla medlemmar som redan är valda någonstans.
  const taken = new Set<string>();
  for (const a of areas) {
    for (const id of sel[a.id] ?? []) if (id) taken.add(id);
  }

  function setSlot(areaId: string, slot: number, value: string) {
    setSel((prev) => {
      const next = [...(prev[areaId] ?? ["", ""])];
      next[slot] = value;
      return { ...prev, [areaId]: next };
    });
  }

  // Återställ till senast sparade tilldelning (ångra ändringar).
  function reset() {
    setSel(buildInitial());
  }

  // Töm alla val.
  function clearAll() {
    const empty: Record<string, string[]> = {};
    for (const a of areas) empty[a.id] = ["", ""];
    setSel(empty);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-clay-400">
        Ansvarsområden
      </legend>
      {areas.map((area) => (
        <div
          key={area.id}
          className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="text-lg font-semibold text-clay-700">{area.name}</h3>
            {area.tid && (
              <span className="text-sm text-clay-400">{area.tid}</span>
            )}
          </div>
          {area.description && (
            <p className="mt-1 text-sm text-clay-500">{area.description}</p>
          )}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ROLES.map((role, slot) => {
              const value = sel[area.id]?.[slot] ?? "";
              const selectId = `${area.id}-slot-${slot}`;
              return (
                <div key={slot}>
                  <label
                    htmlFor={selectId}
                    className="block text-xs font-medium uppercase tracking-wide text-clay-400"
                  >
                    {role}
                  </label>
                  <select
                    id={selectId}
                    name={`assignees-${area.id}`}
                    value={value}
                    onChange={(e) => setSlot(area.id, slot, e.target.value)}
                    className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
                  >
                    <option value="">— ingen —</option>
                    {members.map((m) => (
                      <option
                        key={m.id}
                        value={m.id}
                        disabled={taken.has(m.id) && m.id !== value}
                      >
                        {m.name}
                        {taken.has(m.id) && m.id !== value
                          ? " (redan vald)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-clay-600 hover:bg-sand-50"
        >
          Återställ
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-md border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-clay-500 hover:bg-sand-50"
        >
          Töm alla
        </button>
      </div>
    </fieldset>
  );
}

