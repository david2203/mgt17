import type { Member, Responsibilities } from "./types";
import { formatMeetingDate } from "./format";

export const TABLE_HEADER = ["Initierar", "…med", "Ansvarsområde", "Tidsåtgång"];

// Rader för tabellen: [initierare, med, ansvarsområde, tidsåtgång].
export function buildAssignmentRows(
  members: Member[],
  r: Responsibilities,
): string[][] {
  const nameById = new Map(members.map((m) => [m.id, m.name]));
  return r.areas.map((area) => {
    const names = area.assignees
      .map((id) => nameById.get(id))
      .filter((n): n is string => Boolean(n));
    return [names[0] ?? "—", names[1] ?? "", area.name, area.tid ?? ""];
  });
}

// Bygger en mailto-länk till alla medlemmar med ansvarsområdena som text.
export function buildMembersMailto(
  members: Member[],
  r: Responsibilities,
): string {
  const recipients = members
    .map((m) => m.email)
    .filter((e) => e && e.includes("@"));

  const dateText = r.nextMeetingDate ? formatMeetingDate(r.nextMeetingDate) : "";

  const lines: string[] = [];
  lines.push("Hej!");
  lines.push("");
  lines.push(
    dateText
      ? `Ansvarsområden inför nästa möte (${dateText}):`
      : "Ansvarsområden inför nästa möte:",
  );
  if (r.meetingLink) {
    lines.push("");
    lines.push(`Zoom-länk: ${r.meetingLink}`);
  }
  lines.push("");
  lines.push("[Klistra in tabellen här]");
  lines.push("");
  lines.push("Vi ses!");

  const subject = r.nextMeetingDate
    ? `Ansvarsområden inför nästa möte ${r.nextMeetingDate}`
    : "Ansvarsområden inför nästa möte";
  const body = lines.join("\n");

  return (
    "mailto:" +
    "?bcc=" +
    encodeURIComponent(recipients.join(",")) +
    "&subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}
