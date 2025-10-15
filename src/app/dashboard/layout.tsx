import type React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { DashboardHeader } from "./_components/dashboard-header";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { getToken } from "~/lib/auth-server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
