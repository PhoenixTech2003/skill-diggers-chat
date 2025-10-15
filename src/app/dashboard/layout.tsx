import type React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { DashboardHeader } from "./_components/dashboard-header";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAllRoomMemberShipByUserId } from "~/server/db/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/login");
  }
  const userRoomMembershipPromise = getAllRoomMemberShipByUserId({
    userId: session.session.userId,
  });
  return (
    <SidebarProvider>
      <AppSidebar userRoomMembershipPromise={userRoomMembershipPromise} />
      <SidebarInset className="flex-1">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
