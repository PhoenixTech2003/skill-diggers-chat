import { Skeleton } from "~/components/ui/skeleton";
import { Code2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2">
            <Code2 className="text-primary h-8 w-8" />
            <span className="text-primary text-2xl font-bold">
              Skill Diggers
            </span>
          </div>
          <div className="space-y-2">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="border-border bg-card space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Footer Skeleton */}
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  );
}
