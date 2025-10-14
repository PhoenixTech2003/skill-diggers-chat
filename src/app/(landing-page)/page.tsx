import { Suspense } from "react";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { CTASection } from "./_components/cta-section";
import { LoadingSkeleton } from "./_components/loading-skeleton";
import { api } from "../../../convex/_generated/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "~/lib/auth-server";
import { fetchQuery } from "convex/nextjs";

export default async function LandingPage() {
  const token = await getToken()
  const session = await fetchQuery(api)  

  if (session) {
    redirect("/dashboard");
  }

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
