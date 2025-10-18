"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { LeaderboardTab } from "./_components/leaderboard-tab";
import { IssuesTab } from "./_components/issues-tab";
import { CreateIssueDialog } from "./_components/create-issue-dialog";

export default function BoardPageServer() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">The Board</h2>
        <CreateIssueDialog />
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
          <LeaderboardTab />
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
