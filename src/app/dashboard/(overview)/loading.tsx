import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  const skeletons = Array.from({ length: 6 });
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Join or go to a room
        </h1>
        <p className="text-muted-foreground text-sm">
          Explore available rooms to start chatting, or jump back into one
          you&apos;ve already joined.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skeletons.map((_, i) => (
          <Card key={i} className="bg-card overflow-hidden border">
            <div className="bg-muted flex items-center justify-center p-8">
              <div className="bg-muted-foreground/20 h-12 w-12 rounded-md" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
