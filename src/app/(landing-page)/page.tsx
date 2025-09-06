import { Suspense } from "react";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { CTASection } from "./_components/cta-section";
import { LoadingSkeleton } from "./_components/loading-skeleton";

export default function LandingPage() {
  return (
    <main className="bg-background min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <CTASection />
      </Suspense>
    </main>
  );
}
