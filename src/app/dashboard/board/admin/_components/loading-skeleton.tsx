import { Card, CardHeader } from "~/components/ui/card";

export function AdminBoardLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="bg-muted h-6 w-48 animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-96 animate-pulse rounded-md" />
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-5 w-64 animate-pulse rounded-md" />
                    <div className="bg-muted h-5 w-16 animate-pulse rounded-md" />
                    <div className="bg-muted h-5 w-20 animate-pulse rounded-md" />
                  </div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
                  <div className="flex items-center gap-4">
                    <div className="bg-muted h-3 w-24 animate-pulse rounded-md" />
                    <div className="bg-muted h-3 w-32 animate-pulse rounded-md" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="bg-muted h-8 w-24 animate-pulse rounded-md" />
                  <div className="flex gap-2">
                    <div className="bg-muted h-8 w-28 animate-pulse rounded-md" />
                    <div className="bg-muted h-8 w-32 animate-pulse rounded-md" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
