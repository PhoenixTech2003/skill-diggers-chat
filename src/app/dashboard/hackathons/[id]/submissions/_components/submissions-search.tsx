"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Search } from "lucide-react"

interface SubmissionsSearchProps {
  searchQuery: string | null
  onSearchChange: (value: string | null) => void
}

export function SubmissionsSearch({ searchQuery, onSearchChange }: SubmissionsSearchProps) {
  // Local state for immediate input updates (not throttled)
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery ?? "")

  // Sync local state with query state (for browser back/forward, etc.)
  useEffect(() => {
    setLocalSearchValue(searchQuery ?? "")
  }, [searchQuery])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by team or participant name..."
            value={localSearchValue}
            onChange={(e) => {
              const value = e.target.value
              setLocalSearchValue(value)
              onSearchChange(value || null)
            }}
            className="pl-9"
          />
        </div>
      </CardContent>
    </Card>
  )
}

