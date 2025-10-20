"use client";

import { useState, useEffect } from "react";
import type { Preloaded } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LeaderboardTab } from "./leaderboard-tab";
import { IssuesTab } from "./issues-tab";
import { CreateIssueButton } from "./create-issue-button";

interface BoardPageClientProps {
  preloadedIssues: Preloaded<typeof api.issues.getOpenAndApprovedIssues>;
  preloadedLeaderboard: Preloaded<typeof api.leaderboard.getLeaderboard>;
}

export function BoardPageClient({
  preloadedIssues,
  preloadedLeaderboard,
}: BoardPageClientProps) {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const enrollUser = useMutation(api.leaderboard.enrollCurrentUser);

  useEffect(() => {
    enrollUser({}).catch(console.error);
  });

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
          <LeaderboardTab preloadedLeaderboard={preloadedLeaderboard} />
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab preloadedIssues={preloadedIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
