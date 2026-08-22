export const CONTACT_HEADLINES = [
  <>
    You&rsquo;re launching&hellip;
    <br />
    <span>without me?</span>
  </>,
  <>
    Got a fresh product&hellip;
    <br />
    <span>and you need to make it MOVE</span>
  </>,
  <>
    Building something wild
    <br />
    <span>and need visuals to match?</span>
  </>,
  <>
    Got a CRAZY idea
    <br />
    <span>and need people to see it?</span>
  </>,
  <>
    Got something BIIIG
    <br />
    <span>and you just need to advertise it?</span>
  </>,
];

const SERVICES = [
  "Launch campaign",
  "Trailer",
  "Keynote visuals",
  "Brand placement",
  "Social media content",
  "Something else",
];

const BUDGETS = ["5 - 10k", "10 - 25k", "25 - 50k", "50 - 100k", "100k+"];

export const SERVICE_ITEMS = [
  { label: "Choose a service", value: null },
  ...SERVICES.map((service) => ({ label: service, value: service })),
];

export const BUDGET_ITEMS = [
  { label: "Choose a range", value: null },
  ...BUDGETS.map((budget) => ({ label: budget, value: budget })),
];
