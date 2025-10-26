import { Suspense } from "react";
import { TichezeHero } from "./_components/ticheze-hero";
import { TichezeLoading } from "./_components/loading-skeleton";

export default function TichezePage() {
  return (
    <main className="bg-background min-h-screen">
      <Suspense fallback={<TichezeLoading />}>
        <TichezeHero />
      </Suspense>
    </main>
  );
}
