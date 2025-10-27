import { Suspense } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getToken } from "~/lib/auth-server";
import { TichezeHero } from "./_components/ticheze-hero";
import { TichezeLoading } from "./_components/loading-skeleton";
import { redirect } from "next/navigation";

export default async function TichezePage() {
  let isAdmin = false;
  const token = await getToken();
  if (token) {
    const { sessionData } = await fetchQuery(
      api.users.getLoggedUserSession,
      {},
      { token },
    );
    if (!sessionData?.session) {
      redirect("/auth/login");
    }
    if (sessionData?.user?.role === "admin") {
      isAdmin = true;
    }
  }

  return (
    <main className="bg-background min-h-screen">
      <Suspense fallback={<TichezeLoading />}>
        <TichezeHero isAdmin={isAdmin} />
      </Suspense>
    </main>
  );
}
