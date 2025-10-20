"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/10 border-yellow-500/20";
    case 2:
      return "bg-gray-400/10 border-gray-400/20";
    case 3:
      return "bg-amber-600/10 border-amber-600/20";
    default:
      return "bg-card border-border";
  }
};

export function LeaderboardTab({
  preloadedLeaderboard,
}: {
  preloadedLeaderboard: Preloaded<typeof api.leaderboard.getLeaderboard>;
}) {
  const { leaderboardData, leaderboardDataError } =
    usePreloadedQuery(preloadedLeaderboard);

  if (leaderboardDataError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Developers ranked by points earned from completing bounties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Failed to load leaderboard data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Developers ranked by points earned from completing bounties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No contributors yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
        <CardDescription>
          Developers ranked by points earned from completing bounties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((user, index) => {
            const rank = index + 1;
            const name = user.name || "Unknown User";
            const initials = getInitials(name);

            return (
              <div
                key={user._id}
                className={`hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors ${getRankColor(rank)}`}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex w-8 items-center justify-center">
                    {getRankIcon(rank) || (
                      <span className="text-muted-foreground text-sm font-bold">
                        #{rank}
                      </span>
                    )}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || undefined} alt={name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="px-4 py-1 text-base font-bold"
                >
                  {user.points.toLocaleString()} pts
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
