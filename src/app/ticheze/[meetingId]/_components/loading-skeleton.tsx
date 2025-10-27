export function MeetingRoomLoading() {
  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Header Skeleton */}
      <div className="bg-card border-border border-b px-6 py-4">
        <div className="bg-secondary h-6 w-1/3 animate-pulse rounded-lg" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid Skeleton */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-secondary aspect-video animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="border-border bg-card w-80 border-l">
          <div className="border-border h-12 border-b px-4 py-3">
            <div className="bg-secondary h-4 w-1/3 animate-pulse rounded-lg" />
          </div>
          <div className="flex-1 space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-secondary h-12 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
