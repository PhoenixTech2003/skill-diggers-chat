"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const leaderboardData = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "sarahc",
    points: 2450,
    avatar: "SC",
    rank: 1,
  },
  {
    id: 2,
    name: "Alex Kumar",
    username: "alexk",
    points: 2180,
    avatar: "AK",
    rank: 2,
  },
  {
    id: 3,
    name: "Jordan Lee",
    username: "jordanl",
    points: 1950,
    avatar: "JL",
    rank: 3,
  },
  {
    id: 4,
    name: "Taylor Swift",
    username: "tswift",
    points: 1720,
    avatar: "TS",
    rank: 4,
  },
  {
    id: 5,
    name: "Morgan Davis",
    username: "morgand",
    points: 1580,
    avatar: "MD",
    rank: 5,
  },
  {
    id: 6,
    name: "Casey Brown",
    username: "caseyb",
    points: 1420,
    avatar: "CB",
    rank: 6,
  },
  {
    id: 7,
    name: "Riley Johnson",
    username: "rileyj",
    points: 1290,
    avatar: "RJ",
    rank: 7,
  },
  {
    id: 8,
    name: "Jamie Wilson",
    username: "jamiew",
    points: 1150,
    avatar: "JW",
    rank: 8,
  },
  {
    id: 9,
    name: "Avery Martinez",
    username: "averym",
    points: 980,
    avatar: "AM",
    rank: 9,
  },
  {
    id: 10,
    name: "Quinn Anderson",
    username: "quinna",
    points: 850,
    avatar: "QA",
    rank: 10,
  },
];

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

export function LeaderboardTab() {
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
          {leaderboardData.map((user) => (
            <div
              key={user.id}
              className={`hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors ${getRankColor(user.rank)}`}
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="flex w-8 items-center justify-center">
                  {getRankIcon(user.rank) || (
                    <span className="text-muted-foreground text-sm font-bold">
                      #{user.rank}
                    </span>
                  )}
                </div>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user.avatar}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    @{user.username}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="px-4 py-1 text-base font-bold"
              >
                {user.points.toLocaleString()} pts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
