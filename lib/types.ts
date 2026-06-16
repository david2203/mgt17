export type Member = {
  id: string;
  name: string;
  email: string;
};

export type MeetingStep = {
  title: string;
  duration?: string; // t.ex. "5–7 min" eller "1–2 min/man"
  description?: string;
  substeps?: string[];
};

export type MeetingAgreements = {
  title?: string;
  intro?: string;
  items: string[];
};

export type MeetingStructure = {
  title: string;
  intro?: string;
  agreements?: MeetingAgreements;
  steps: MeetingStep[];
};

// En del av processguiden: en valfri rubrik + introtext + numrerade steg/frågor.
export type ProcessSection = {
  title?: string;
  intro?: string;
  steps?: string[];
  startNumber?: number; // för fortlöpande numrering över flera avsnitt
  note?: string;
};

export type Process = {
  id: string;
  name: string;
  // Översikt (från processtabellen)
  syfte?: string;
  anvandbarNar?: string;
  kommentar?: string;
  // Fördjupning (faciliteringsguide)
  intention?: string;
  energi?: string;
  tid?: string;
  sections?: ProcessSection[];
};

export type ResponsibilityArea = {
  id: string;
  name: string;
  description?: string;
  tid?: string; // tidsåtgång, t.ex. "5 min"
  // member ids; första = initierare, övriga = "med"
  assignees: string[];
};

export type Responsibilities = {
  nextMeetingDate: string;
  nextMeetingNote?: string;
  meetingLink?: string; // länk till plats/Zoom för nästa möte
  areas: ResponsibilityArea[];
};

// Enkel informationssida uppbyggd av block (rubriker, stycken, listor).
export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; title?: string; ordered?: boolean; items: string[] };

export type InfoPage = {
  title: string;
  subtitle?: string;
  intro?: string;
  blocks: ContentBlock[];
  footer?: string;
};
