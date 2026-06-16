import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type {
  InfoPage,
  Member,
  MeetingStructure,
  Process,
  Responsibilities,
} from "./types";

// Statiska data bundlas in (importeras), så de alltid finns tillgängliga i
// körtid – även på serverless-hosting som Vercel.
import membersData from "@/data/members.json";
import meetingStructureData from "@/data/meeting-structure.json";
import processesData from "@/data/processes.json";
import arbetsrundaData from "@/data/arbetsrunda.json";
import riktlinjerData from "@/data/riktlinjer.json";
import responsibilitiesSeed from "@/data/responsibilities.json";

export function getMembers(): Promise<Member[]> {
  return Promise.resolve(membersData as Member[]);
}

export function getMeetingStructure(): Promise<MeetingStructure> {
  return Promise.resolve(meetingStructureData as MeetingStructure);
}

export function getProcesses(): Promise<Process[]> {
  return Promise.resolve(processesData as Process[]);
}

export async function getProcess(id: string): Promise<Process | undefined> {
  const all = await getProcesses();
  return all.find((p) => p.id === id);
}

export function getArbetsrunda(): Promise<InfoPage> {
  return Promise.resolve(arbetsrundaData as InfoPage);
}

export function getRiktlinjer(): Promise<InfoPage> {
  return Promise.resolve(riktlinjerData as InfoPage);
}

// --- Ansvarsområden (det enda som ändras via admin) -------------------------
// I produktion (Vercel) lagras de i Upstash Redis. Lokalt används JSON-filen.

const RESP_KEY = "mansgrupp:responsibilities";

function redis(): Redis | null {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return Redis.fromEnv();
  }
  return null;
}

const respFile = path.join(process.cwd(), "data", "responsibilities.json");

export async function getResponsibilities(): Promise<Responsibilities> {
  const r = redis();
  if (r) {
    const stored = await r.get<Responsibilities>(RESP_KEY);
    return stored ?? (responsibilitiesSeed as Responsibilities);
  }
  // Lokalt: läs från filen (faller tillbaka på den bundlade seeden).
  try {
    const raw = await fs.readFile(respFile, "utf-8");
    return JSON.parse(raw) as Responsibilities;
  } catch {
    return responsibilitiesSeed as Responsibilities;
  }
}

export async function saveResponsibilities(
  value: Responsibilities,
): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(RESP_KEY, value);
    return;
  }
  // Lokalt: skriv till filen.
  await fs.writeFile(respFile, JSON.stringify(value, null, 2) + "\n", "utf-8");
}
