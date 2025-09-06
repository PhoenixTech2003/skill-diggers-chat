import type React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { DashboardHeader } from "./_components/dashboard-header";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="bg-background flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
