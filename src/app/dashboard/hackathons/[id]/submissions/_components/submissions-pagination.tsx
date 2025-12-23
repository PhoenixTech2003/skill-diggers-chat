"use client"

import { Button } from "~/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmissionsPaginationProps {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted"
  isLoading: boolean
  onLoadMore: () => void
}

export function SubmissionsPagination({ status, isLoading, onLoadMore }: SubmissionsPaginationProps) {
  if (status === "Exhausted") {
    return (
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">No more submissions to load</p>
      </div>
    )
  }

  if (status === "CanLoadMore" || status === "LoadingMore") {
    return (
      <div className="flex justify-center pt-4">
        <Button
          onClick={onLoadMore}
          disabled={status === "LoadingMore"}
          variant="outline"
          className="min-w-[120px]"
        >
          {status === "LoadingMore" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    )
  }

  return null
}

