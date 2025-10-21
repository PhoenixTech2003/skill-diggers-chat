import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Hash,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    title: "Active Rooms",
    value: "12",
    change: "+2 from yesterday",
    icon: MessageSquare,
    trend: "up",
  },
  {
    title: "Online Users",
    value: "1,234",
    change: "+180 from yesterday",
    icon: Users,
    trend: "up",
  },
  {
    title: "Messages Today",
    value: "8,432",
    change: "+12% from yesterday",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Avg. Response Time",
    value: "2.3m",
    change: "-30s from yesterday",
    icon: Clock,
    trend: "down",
  },
];

const recentRooms = [
  { name: "JavaScript", lastMessage: "2 minutes ago", unread: 3, active: true },
  { name: "React", lastMessage: "5 minutes ago", unread: 0, active: true },
  { name: "Python", lastMessage: "12 minutes ago", unread: 7, active: true },
  { name: "TypeScript", lastMessage: "1 hour ago", unread: 0, active: false },
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">
          Welcome back, John!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your programming community today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-card-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-card-foreground text-2xl font-bold">
                {stat.value}
              </div>
              <p
                className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Recent Room Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRooms.map((room, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Hash className="text-muted-foreground h-4 w-4" />
                    <span className="text-card-foreground font-medium">
                      {room.name}
                    </span>
                    {room.active && (
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {room.unread > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {room.unread}
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-sm">
                    {room.lastMessage}
                  </span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="mt-4 w-full bg-transparent">
              View All Rooms
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start New Conversation
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Users className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <Hash className="mr-2 h-4 w-4" />
              Create Room
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
