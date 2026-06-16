"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getResponsibilities, saveResponsibilities } from "./data";

export async function updateResponsibilities(formData: FormData) {
  const current = await getResponsibilities();

  const nextMeetingDate = String(formData.get("nextMeetingDate") || "").trim();
  const nextMeetingNote = String(formData.get("nextMeetingNote") || "").trim();
  const meetingLink = String(formData.get("meetingLink") || "").trim();

  const areas = current.areas.map((area) => {
    const assignees = formData
      .getAll(`assignees-${area.id}`)
      .map((v) => String(v))
      .filter(Boolean);
    return { ...area, assignees };
  });

  await saveResponsibilities({
    ...current,
    nextMeetingDate: nextMeetingDate || current.nextMeetingDate,
    nextMeetingNote: nextMeetingNote || undefined,
    meetingLink: meetingLink || undefined,
    areas,
  });

  revalidatePath("/infor-nasta-mote");
  revalidatePath("/admin");
  redirect("/admin?sparat=1");
}
