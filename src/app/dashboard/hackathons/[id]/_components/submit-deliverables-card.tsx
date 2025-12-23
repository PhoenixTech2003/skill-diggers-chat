"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Clock, Loader2 } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { toast } from "sonner"
import { useEffect } from "react"
import { submitDeliverablesSchema, type SubmitDeliverablesSchema } from "./submit-deliverables-schema"
import type { HackathonData } from "./types"

interface SubmitDeliverablesCardProps {
  hackathon: HackathonData
}

export function SubmitDeliverablesCard({ hackathon }: SubmitDeliverablesCardProps) {
  const existingSubmission = useQuery(api.hackathon.getUserSubmission, {
    hackathonId: hackathon._id as any,
  })
  const submitDeliverablesMutation = useMutation(api.hackathon.submitDeliverables)

  const form = useForm<SubmitDeliverablesSchema>({
    resolver: zodResolver(submitDeliverablesSchema),
    defaultValues: {
      liveLink: "",
      githubLink: "",
      linkedInPosts: [],
    },
  })

  const { fields: linkedInFields, append: appendLinkedIn, remove: removeLinkedIn } = useFieldArray({
    control: form.control,
    // @ts-expect-error - TypeScript inference issue with useFieldArray
    name: "linkedInPosts",
  })

  // Load existing submission data
  useEffect(() => {
    if (existingSubmission) {
      form.reset({
        liveLink: existingSubmission.liveLink,
        githubLink: existingSubmission.githubLink,
        linkedInPosts: existingSubmission.linkedInPosts || [],
      })
    }
  }, [existingSubmission, form])

  // Initialize LinkedIn posts fields if required
  useEffect(() => {
    if (hackathon.requireLinkedIn && hackathon.linkedInPostsRequired) {
      const currentCount = linkedInFields.length
      const requiredCount = hackathon.linkedInPostsRequired
      
      if (currentCount < requiredCount) {
        // Add missing fields
        for (let i = currentCount; i < requiredCount; i++) {
          appendLinkedIn("")
        }
      } else if (currentCount > requiredCount) {
        // Remove excess fields
        for (let i = currentCount - 1; i >= requiredCount; i--) {
          removeLinkedIn(i)
        }
      }
    } else {
      // Clear all LinkedIn fields if not required
      while (linkedInFields.length > 0) {
        removeLinkedIn(0)
      }
    }
  }, [hackathon.requireLinkedIn, hackathon.linkedInPostsRequired, linkedInFields.length, appendLinkedIn, removeLinkedIn])

  const onSubmit = async (values: SubmitDeliverablesSchema) => {
    try {
      // Filter out empty LinkedIn posts
      const validLinkedInPosts = values.linkedInPosts.filter((post) => post.trim() !== "")
      
      // Validate LinkedIn posts if required
      if (hackathon.requireLinkedIn && hackathon.linkedInPostsRequired) {
        if (validLinkedInPosts.length < hackathon.linkedInPostsRequired) {
          toast.error(`At least ${hackathon.linkedInPostsRequired} LinkedIn post(s) are required`)
          return
        }
        
        // Validate all LinkedIn posts are valid URLs
        const invalidPosts = validLinkedInPosts.filter((post) => {
          try {
            new URL(post)
            return false
          } catch {
            return true
          }
        })
        
        if (invalidPosts.length > 0) {
          toast.error("All LinkedIn post links must be valid URLs")
          return
        }
      }

      await submitDeliverablesMutation({
        hackathonId: hackathon._id as any,
        liveLink: values.liveLink,
        githubLink: values.githubLink,
        linkedInPosts: validLinkedInPosts,
      })

      toast.success(existingSubmission ? "Deliverables updated successfully!" : "Deliverables submitted successfully!")
    } catch (error) {
      console.error("Submit deliverables error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit deliverables. Please try again.")
    }
  }

  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-500" />
          Submit Your Deliverables
        </CardTitle>
        <CardDescription>
          {existingSubmission ? "Update your project deliverables" : "Upload your project deliverables before the deadline"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="liveLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Project Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-project-demo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codebase Link (GitHub)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {hackathon.requireLinkedIn && hackathon.linkedInPostsRequired && (
              <div className="space-y-2">
                <FormLabel>
                  LinkedIn Posts ({hackathon.linkedInPostsRequired} required)
                </FormLabel>
                {linkedInFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`linkedInPosts.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`LinkedIn post ${index + 1}: https://linkedin.com/posts/...`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormDescription>
                  Provide links to {hackathon.linkedInPostsRequired} LinkedIn post(s) about your project
                </FormDescription>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingSubmission ? "Updating..." : "Submitting..."}
                </>
              ) : (
                existingSubmission ? "Update Deliverables" : "Submit Deliverables"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

