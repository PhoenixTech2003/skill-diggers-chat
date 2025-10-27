"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h2 className="text-foreground text-2xl font-bold">Meeting Error</h2>
        <p className="text-muted-foreground">Failed to load the meeting room</p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary/90"
          >
            Try again
          </Button>
          <Button
            onClick={() => router.push("/ticheze")}
            variant="outline"
            className="border-border hover:bg-secondary"
          >
            Back to Ticheze
          </Button>
        </div>
      </div>
    </div>
  );
}
