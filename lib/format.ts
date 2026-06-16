// Mötena hålls alltid på denna tid.
export const MEETING_TIME = "18:50–21:30";

// Formatera ett ISO-datum (YYYY-MM-DD) till svensk läsbar form.
export function formatSwedishDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// Datum + fast mötestid, t.ex. "måndag 29 juni 2026, kl. 18:50–21:30".
export function formatMeetingDate(iso: string): string {
  return `${formatSwedishDate(iso)}, kl. ${MEETING_TIME}`;
}
