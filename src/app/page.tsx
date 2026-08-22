import { headers } from "next/headers";

import { getContactRegionFromRequest } from "./_landing/contact/contact-form-model";
import MiizuLanding from "./MiizuLanding";

export const dynamic = "force-dynamic";

const COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "cloudfront-viewer-country",
] as const;

export default async function HomePage() {
  const headerStore = await headers();
  const country = COUNTRY_HEADERS.reduce<string | null>(
    (found, name) => found ?? headerStore.get(name),
    null,
  );
  const initialRegion = getContactRegionFromRequest({
    country,
    acceptLanguage: headerStore.get("accept-language"),
  });

  return <MiizuLanding initialRegion={initialRegion} />;
}
