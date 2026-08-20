import LandingPreloader from "@/components/LandingPreloader";

import MiizuLanding from "./MiizuLanding";

export default function HomePage() {
  return (
    <LandingPreloader>
      <MiizuLanding />
    </LandingPreloader>
  );
}
