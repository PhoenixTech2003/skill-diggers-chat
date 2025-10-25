"use client";

import { useState } from "react";
import type { Preloaded } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UnapprovedIssuesTab } from "./unapproved-issues-tab";
import { ApprovedIssuesTab } from "./approved-issues-tab";
import { SubmittedBountiesTab } from "./submitted-bounties-tab";

interface AdminBoardClientProps {
  preloadedUnapprovedIssues: Preloaded<typeof api.issues.getUnapprovedIssues>;
  preloadedApprovedIssues: Preloaded<typeof api.issues.getApprovedIssues>;
}

export function AdminBoardClient({
  preloadedUnapprovedIssues,
  preloadedApprovedIssues,
}: AdminBoardClientProps) {
  const [activeTab, setActiveTab] = useState("unapproved");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full max-w-lg grid-cols-3">
        <TabsTrigger value="unapproved">Unapproved</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="submitted">Submitted Bounties</TabsTrigger>
      </TabsList>
      <TabsContent value="unapproved">
        <UnapprovedIssuesTab preloadedIssues={preloadedUnapprovedIssues} />
      </TabsContent>
      <TabsContent value="approved">
        <ApprovedIssuesTab preloadedIssues={preloadedApprovedIssues} />
      </TabsContent>
      <TabsContent value="submitted">
        <SubmittedBountiesTab />
      </TabsContent>
    </Tabs>
  );
}
