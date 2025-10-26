"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-foreground mb-4 text-2xl font-bold">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">Failed to load Ticheze</p>
        <Button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary/90"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
