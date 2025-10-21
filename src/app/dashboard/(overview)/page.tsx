import { Suspense } from "react";
import { DashboardContent } from "./_components/dashboard-content";
import { LoadingSkeleton } from "./_components/loading-skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
