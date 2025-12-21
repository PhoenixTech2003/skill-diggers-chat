import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>

      {/* Search and Tabs Section */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full max-w-md" />

        {/* Tabs Skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 sm:w-24" />
          ))}
        </div>

        {/* Hackathon Cards Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

