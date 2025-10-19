import type React from "react";
import { ChangelogSidebar } from "./_components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { getChangelogSidebarItems } from "~/lib/changelog";

export default async function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const changelogItems = await getChangelogSidebarItems();

  return (
    <SidebarProvider>
      <ChangelogSidebar changelogItems={changelogItems} />
      <SidebarInset className="flex-1">
        <header className="border-border bg-card flex h-16 items-center border-b px-6">
          <SidebarTrigger className="bg-blue-600 text-white hover:bg-blue-700" />
        </header>
        <main className="prose dark:prose-invert max-w-none p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
