import { promises as fs } from "fs";
import path from "path";
import type {
  InfoPage,
  Member,
  MeetingStructure,
  Process,
  Responsibilities,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, file), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, value: unknown): Promise<void> {
  const full = path.join(dataDir, file);
  await fs.writeFile(full, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

export function getMembers(): Promise<Member[]> {
  return readJson<Member[]>("members.json");
}

export function getMeetingStructure(): Promise<MeetingStructure> {
  return readJson<MeetingStructure>("meeting-structure.json");
}

export function getProcesses(): Promise<Process[]> {
  return readJson<Process[]>("processes.json");
}

export async function getProcess(id: string): Promise<Process | undefined> {
  const all = await getProcesses();
  return all.find((p) => p.id === id);
}

export function getResponsibilities(): Promise<Responsibilities> {
  return readJson<Responsibilities>("responsibilities.json");
}

export function getArbetsrunda(): Promise<InfoPage> {
  return readJson<InfoPage>("arbetsrunda.json");
}

export function getRiktlinjer(): Promise<InfoPage> {
  return readJson<InfoPage>("riktlinjer.json");
}

export function saveResponsibilities(value: Responsibilities): Promise<void> {
  return writeJson("responsibilities.json", value);
}
