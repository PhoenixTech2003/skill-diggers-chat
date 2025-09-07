"use client";

import { Button } from "~/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <Button disabled> Create room </Button>
      </div>
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="bg-card text-destructive border-destructive/30 mx-auto w-full max-w-md rounded-lg border p-6 text-center">
          <p className="mb-4 text-sm">
            Something went wrong while loading rooms.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
