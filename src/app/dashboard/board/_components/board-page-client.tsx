"use client";

import { useState } from "react";
import type { Preloaded } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LeaderboardTab } from "./leaderboard-tab";
import { IssuesTab } from "./issues-tab";
import { CreateIssueButton } from "./create-issue-button";

interface BoardPageClientProps {
  preloadedIssues: Preloaded<typeof api.issues.getOpenAndApprovedIssues>;
}

export function BoardPageClient({ preloadedIssues }: BoardPageClientProps) {
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">The Board</h2>
        <CreateIssueButton />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab preloadedIssues={preloadedIssues} />
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab preloadedIssues={preloadedIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
