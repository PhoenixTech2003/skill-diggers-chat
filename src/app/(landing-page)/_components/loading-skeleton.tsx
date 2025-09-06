import { Skeleton } from "~/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="bg-background min-h-screen p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-12 py-20 lg:flex-row">
          {/* Left Content Skeleton */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <Skeleton className="mx-auto h-8 w-48 lg:mx-0" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="flex justify-center gap-4 lg:justify-start">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="flex-1">
            <div className="relative mx-auto h-96 w-full max-w-md">
              <Skeleton className="absolute top-4 left-8 h-20 w-20 rounded-xl" />
              <Skeleton className="absolute top-16 right-4 h-20 w-20 rounded-xl" />
              <Skeleton className="absolute bottom-20 left-4 h-20 w-20 rounded-xl" />
              <Skeleton className="absolute right-8 bottom-4 h-20 w-20 rounded-xl" />
              <Skeleton className="absolute inset-0 m-auto h-32 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
