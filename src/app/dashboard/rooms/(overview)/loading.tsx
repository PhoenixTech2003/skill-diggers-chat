import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  const skeletons = Array.from({ length: 6 });
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Manage your rooms here
          </h1>
          <p className="text-muted-foreground text-sm">
            Create, join, or jump into rooms you already belong to.
          </p>
        </div>
        <div className="bg-muted h-9 w-28 rounded-md" />
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
