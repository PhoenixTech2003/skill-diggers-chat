"use client"

import { Card, CardContent } from "~/components/ui/card"

interface EmptyStateProps {
  hasSearchQuery: boolean
}

export function EmptyState({ hasSearchQuery }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No submissions found</p>
          <p className="text-sm text-muted-foreground">
            {hasSearchQuery ? "Try adjusting your search query" : "No participants have submitted yet"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

