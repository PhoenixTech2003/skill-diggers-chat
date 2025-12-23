"use client"

import { useState, useMemo, useEffect } from "react"
import { usePaginatedQuery, useMutation, useQuery } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { useQueryState } from "nuqs"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { Id } from "../../../../../../../convex/_generated/dataModel"
import { SubmissionsHeader } from "./submissions-header"
import { SubmissionsSearch } from "./submissions-search"
import { StatusBanner } from "./status-banner"
import { SubmissionCard } from "./submission-card"
import { EmptyState } from "./empty-state"
import { SubmissionsPagination } from "./submissions-pagination"

interface SubmissionsInterfaceProps {
  hackathonId: string
}

interface Submission {
  _id: Id<"hackathonSubmissions">
  teamName: string
  type: "team" | "individual"
  members: string[]
  submittedAt: number
  liveLink: string
  githubLink: string
  linkedInPosts: string[]
  position: "1st Place" | "2nd Place" | "3rd Place" | "Honorable Mention" | null
  resultsPublished?: boolean
}

export function SubmissionsInterface({ hackathonId }: SubmissionsInterfaceProps) {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 400,
  })

  const [isPublishing, setIsPublishing] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Get hackathon data to check if results are published
  const hackathonData = useQuery(api.hackathon.getHackathonById, {
    hackathonId: hackathonId as Id<"hackathons">,
  })

  // Memoize query arguments to prevent unnecessary rerenders
  // Only recreate when searchQuery or hackathonId actually changes
  const queryArgs = useMemo(
    () => ({
      hackathonId: hackathonId as Id<"hackathons">,
      search: searchQuery && searchQuery.trim() !== "" ? searchQuery.trim() : undefined,
    }),
    [hackathonId, searchQuery]
  )

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.hackathon.getHackathonSubmissionsPaginated,
    queryArgs,
    { initialNumItems: 10 }
  )

  // Track when initial load is complete
  useEffect(() => {
    if (results !== undefined && isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [results, isInitialLoad])

  const updatePositionMutation = useMutation(api.hackathon.updateSubmissionPosition)
  const publishResultsMutation = useMutation(api.hackathon.publishHackathonResults)

  // Transform submissions to match component interface
  const transformedSubmissions: Submission[] = results
    ? results.map((sub) => ({
        _id: sub._id,
        teamName: sub.teamName,
        type: sub.type,
        members: sub.members,
        submittedAt: sub.submittedAt,
        liveLink: sub.liveLink,
        githubLink: sub.githubLink,
        linkedInPosts: sub.linkedInPosts,
        position: sub.position || null,
        resultsPublished: sub.resultsPublished,
      }))
    : []

  const resultsPublished = (hackathonData as any)?.resultsPublished ?? false
  const assignedPositions = transformedSubmissions.filter((s) => s.position).length

  const handlePositionChange = async (submissionId: Id<"hackathonSubmissions">, position: string) => {
    try {
      await updatePositionMutation({
        submissionId,
        position: position === "none" ? undefined : (position as any),
      })
      toast.success("Position updated successfully")
    } catch (error) {
      console.error("Update position error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update position. Please try again.")
    }
  }

  const handlePublishResults = async () => {
    setIsPublishing(true)
    try {
      await publishResultsMutation({
        hackathonId: hackathonId as Id<"hackathons">,
      })
      toast.success("Results published successfully!")
    } catch (error) {
      console.error("Publish results error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to publish results. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  // Only show full loading screen on initial load, not when search changes
  if (isLoading && status === "LoadingFirstPage" && isInitialLoad) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <SubmissionsHeader
        totalSubmissions={transformedSubmissions.length}
        assignedPositions={assignedPositions}
        resultsPublished={resultsPublished}
        isPublishing={isPublishing}
        onPublishResults={handlePublishResults}
      />

      <SubmissionsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <StatusBanner resultsPublished={resultsPublished} />

      {/* Show loading indicator when searching without hiding the input */}
      {isLoading && status === "LoadingFirstPage" && !isInitialLoad && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      )}

      {!isLoading && transformedSubmissions.length === 0 ? (
        <EmptyState hasSearchQuery={!!searchQuery} />
      ) : (
        transformedSubmissions.length > 0 && (
          <>
            <div className="space-y-4">
              {transformedSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission._id}
                  submission={submission}
                  resultsPublished={resultsPublished}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </div>

            <SubmissionsPagination
              status={status}
              isLoading={isLoading}
              onLoadMore={() => loadMore(10)}
            />
          </>
        )
      )}
    </div>
  )
}
