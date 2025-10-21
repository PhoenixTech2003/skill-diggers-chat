import { Suspense } from "react";
import { DashboardContent } from "./_components/dashboard-content";
import { LoadingSkeleton } from "./_components/loading-skeleton";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const token = await getToken();
  const { sessionData, sessionDataError } = await fetchQuery(
    api.users.getLoggedUserSession,
    {},
    { token },
  );
  if (sessionDataError) {
    throw new Error(sessionDataError);
  }
  if (!sessionData?.session) {
    redirect("/auth/login");
  }
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
