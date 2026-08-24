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
  const initialRegion = getContactRegionFromRequest({
    countries: COUNTRY_HEADERS.map((name) => headerStore.get(name)),
  });

  return <MiizuLanding initialRegion={initialRegion} />;
}
