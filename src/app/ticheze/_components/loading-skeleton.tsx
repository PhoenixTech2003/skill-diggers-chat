export function TichezeLoading() {
  return (
    <div className="grid min-h-screen grid-cols-1 items-center gap-8 px-6 py-12 lg:grid-cols-2 lg:gap-12 lg:px-12">
      {/* Left Section Skeleton */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="bg-secondary h-16 w-3/4 animate-pulse rounded-lg" />
          <div className="bg-secondary h-6 w-1/2 animate-pulse rounded-lg" />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="bg-secondary h-8 w-2/3 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-secondary h-4 w-full animate-pulse rounded-lg" />
              <div className="bg-secondary h-4 w-5/6 animate-pulse rounded-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-secondary h-6 w-1/3 animate-pulse rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-secondary h-4 w-full animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-secondary h-32 animate-pulse rounded-lg" />
      </div>

      {/* Right Section Skeleton */}
      <div className="bg-secondary aspect-square w-full animate-pulse rounded-2xl" />
    </div>
  );
}
