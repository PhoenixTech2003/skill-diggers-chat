import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { AdminBoardClient } from "./_components/admin-board-client";
import { redirect } from "next/navigation";
import { getToken } from "~/lib/auth-server";

export default async function AdminBoardPage() {
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
  if (sessionData?.user.role !== "admin") {
    redirect("/dashboard");
  }
  const preloadedUnapprovedIssues = await preloadQuery(
    api.issues.getUnapprovedIssues,
    {},
  );

  const preloadedApprovedIssues = await preloadQuery(
    api.issues.getApprovedIssues,
    {},
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">The Board - Admin</h2>
      </div>
      <AdminBoardClient
        preloadedUnapprovedIssues={preloadedUnapprovedIssues}
        preloadedApprovedIssues={preloadedApprovedIssues}
      />
    </div>
  );
}
