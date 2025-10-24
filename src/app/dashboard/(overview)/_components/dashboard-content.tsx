"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Users, CheckCircle, ArrowRight, Target } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { StatCard } from "./stat-card";
import { AnimatedPointsCard } from "./animated-points-card";

export function DashboardContent() {
  const { data } = authClient.useSession();
  const router = useRouter();
  const userStats = useQuery(api.dashboard.getUserStats);

  const username = data?.user.name;

  if (userStats?.userStatsDataError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-foreground text-3xl font-bold">
            Welcome back, {username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your programming community today.
          </p>
        </div>
        <div className="text-muted-foreground text-center">
          Error loading dashboard data: {userStats.userStatsDataError}
        </div>
      </div>
    );
  }

  if (!userStats?.userStatsData) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-foreground text-3xl font-bold">
            Welcome back, {username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your programming community today.
          </p>
        </div>
        <div className="text-muted-foreground text-center">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  const { roomsJoined, bountiesCompleted, leaderboardPoints } =
    userStats.userStatsData;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">
          Welcome back, {username}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your programming community today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard title="Rooms Joined" value={roomsJoined} icon={Users} />
        <StatCard
          title="Bounties Completed"
          value={bountiesCompleted}
          icon={CheckCircle}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/dashboard/bounties")}
              className="w-full justify-start"
            >
              <Target className="mr-2 h-4 w-4" />
              Go to Bounties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Animated Points Card */}
        <AnimatedPointsCard points={leaderboardPoints} />
      </div>
    </div>
  );
}
