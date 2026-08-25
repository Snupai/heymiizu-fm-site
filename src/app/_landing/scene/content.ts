export const CLIENTS = [
  "Duolingo",
  "Finanzguru",
  "Revolut",
  "Anyfin",
  "Shoop",
  "Carvertical",
  "Adobe",
  "Formelskin",
  "HOLY",
  "Airalo",
];

export const CLIENT_MARQUEE_ROWS = 2;

export const WORK_LINES = [
  { id: "directed", text: "I’ve directed", variant: "lead" },
  { id: "launches", text: "Launches", variant: "item" },
  { id: "trailers", text: "Trailers", variant: "item" },
  { id: "keynotes", text: "Keynotes", variant: "item" },
  { id: "placements", text: "Placements", variant: "itemEnd" },
  { id: "brands", text: "for brands", variant: "close" },
  { id: "creators", text: "and creators", variant: "close" },
] as const;

export type WorkLineVariant = (typeof WORK_LINES)[number]["variant"];
