"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { createHackathonFormSchema, type CreateHackathonFormSchema } from "../../../create/_components/create-hackathon-form-schema"
import { useRouter } from "next/navigation"
import { usePreloadedQuery, useMutation } from "convex/react"
import { type Preloaded } from "convex/react"
import { api } from "../../../../../../../convex/_generated/api"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ArrowLeft, CalendarIcon, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { Switch } from "~/components/ui/switch"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { format } from "date-fns"
import { cn } from "~/lib/utils"
import { useEffect } from "react"
import type { Id } from "../../../../../../../convex/_generated/dataModel"

interface EditHackathonFormProps {
  preloadedHackathon: Preloaded<typeof api.hackathon.getHackathonById>
  hackathonId: Id<"hackathons">
}

export function EditHackathonForm({ preloadedHackathon, hackathonId }: EditHackathonFormProps) {
  const router = useRouter()
  const hackathonData = usePreloadedQuery(preloadedHackathon)
  const updateHackathon = useMutation(api.hackathon.updateHackathon)

  const form = useForm<CreateHackathonFormSchema>({
    resolver: zodResolver(createHackathonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fullDescription: "",
      registrationStart: "",
      registrationEnd: "",
      hackathonStart: "",
      hackathonEnd: "",
      location: "",
      maxParticipants: 1,
      prize: "",
      prizeType: "cash",
      requireLinkedIn: false,
      linkedInPostsRequired: 1,
      allowTeams: false,
      rules: [""],
      prizes: [{ place: "", amount: "" }],
      schedule: [{ time: "", event: "" }],
    },
  })

  // Pre-fill form with existing hackathon data
  useEffect(() => {
    if (hackathonData) {
      form.reset({
        title: hackathonData.title,
        description: hackathonData.description,
        fullDescription: hackathonData.fullDescription,
        registrationStart: hackathonData.registrationStart,
        registrationEnd: hackathonData.registrationEnd,
        hackathonStart: hackathonData.hackathonStart,
        hackathonEnd: hackathonData.hackathonEnd,
        location: hackathonData.location,
        maxParticipants: hackathonData.maxParticipants,
        prize: hackathonData.prize,
        prizeType: hackathonData.prizeType,
        requireLinkedIn: hackathonData.requireLinkedIn,
        linkedInPostsRequired: hackathonData.linkedInPostsRequired || 1,
        allowTeams: hackathonData.allowTeams,
        rules: hackathonData.rules && hackathonData.rules.length > 0 ? hackathonData.rules : [""],
        prizes: hackathonData.prizes && hackathonData.prizes.length > 0 ? hackathonData.prizes : [{ place: "", amount: "" }],
        schedule: hackathonData.schedule && hackathonData.schedule.length > 0 ? hackathonData.schedule : [{ time: "", event: "" }],
      })
    }
  }, [hackathonData, form])

  const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
    control: form.control,
    // @ts-expect-error - TypeScript inference issue with useFieldArray
    name: "rules",
  })

  const { fields: prizeFields, append: appendPrize, remove: removePrize } = useFieldArray({
    control: form.control,
    name: "prizes",
  })

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control: form.control,
    name: "schedule",
  })

  const prizeType = form.watch("prizeType")
  const requireLinkedIn = form.watch("requireLinkedIn")
  const linkedInPostsRequired = form.watch("linkedInPostsRequired")

  const onSubmit = async (values: CreateHackathonFormSchema) => {
    // Prepare data for mutation - ensure location is the correct type
    const location = values.location as "virtual" | "in-person" | "hybrid"
    const prizeType = values.prizeType as "cash" | "points"

    // Only include linkedInPostsRequired if requireLinkedIn is true
    const mutationData = {
      hackathonId,
      title: values.title,
      description: values.description,
      fullDescription: values.fullDescription,
      registrationStart: values.registrationStart,
      registrationEnd: values.registrationEnd,
      hackathonStart: values.hackathonStart,
      hackathonEnd: values.hackathonEnd,
      location,
      maxParticipants: values.maxParticipants,
      prize: values.prize,
      prizeType,
      requireLinkedIn: values.requireLinkedIn,
      linkedInPostsRequired: values.requireLinkedIn ? values.linkedInPostsRequired : undefined,
      allowTeams: values.allowTeams,
      rules: values.rules.filter((rule) => rule.trim() !== ""), // Filter out empty rules
      prizes: values.prizes.filter((prize) => prize.place.trim() !== "" && prize.amount.trim() !== ""), // Filter out empty prizes
      schedule: values.schedule.filter((item) => item.time.trim() !== "" && item.event.trim() !== ""), // Filter out empty schedule items
    }

    const promise = updateHackathon(mutationData)

    toast.promise(promise, {
      loading: "Updating hackathon...",
      success: () => {
        router.push(`/dashboard/hackathons/${hackathonId.toString()}`)
        return "Hackathon updated successfully!"
      },
      error: (error) => {
        console.error("Error updating hackathon:", error)
        return error instanceof Error ? error.message : "Failed to update hackathon. Please try again."
      },
    })
  }

  if (!hackathonData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Hackathon not found</h2>
          <p className="text-muted-foreground">The hackathon you're looking for doesn't exist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/hackathons/${hackathonId.toString()}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-balance">Edit Hackathon</h1>
          <p className="text-muted-foreground">Update hackathon information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Details</CardTitle>
              <CardDescription>Update the information about your hackathon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hackathon Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI Innovation Challenge 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief one-line description of the hackathon..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description about what participants will be building, the goals of the hackathon, resources available, etc..."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registrationStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationEnd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hackathonStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Hackathon Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hackathonEnd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Hackathon End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 500"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="prizeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Type</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant={field.value === "cash" ? "default" : "outline"}
                            onClick={() => field.onChange("cash")}
                            className="flex-1"
                          >
                            Cash Prizes
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "points" ? "default" : "outline"}
                            onClick={() => field.onChange("points")}
                            className="flex-1"
                          >
                            Points Prizes
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Prize Pool</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={prizeType === "cash" ? "e.g., $10,000" : "e.g., 10,000 points"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 border-t pt-6">
                <FormField
                  control={form.control}
                  name="requireLinkedIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">LinkedIn Post Requirement</FormLabel>
                        <FormDescription>
                          Require participants to provide links to LinkedIn posts
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {requireLinkedIn && (
                  <FormField
                    control={form.control}
                    name="linkedInPostsRequired"
                    render={({ field }) => (
                      <FormItem className="pl-6">
                        <FormLabel>Number of LinkedIn Posts Required</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="e.g., 1"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>
                          Participants will need to submit {linkedInPostsRequired} LinkedIn post link
                          {linkedInPostsRequired !== 1 ? "s" : ""} to complete registration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4 border-t pt-6">
                <FormField
                  control={form.control}
                  name="allowTeams"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Team Submissions</FormLabel>
                        <FormDescription>Enable participants to register and compete as teams</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Prize Breakdown</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPrize({ place: "", amount: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prize
                  </Button>
                </div>
                <div className="space-y-3">
                  {prizeFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.place`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="e.g., 1st Place" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.amount`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={prizeType === "cash" ? "e.g., $5,000" : "e.g., 5000 points"}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {prizeFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePrize(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Rules & Guidelines</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // @ts-expect-error - TypeScript inference issue with useFieldArray
                      appendRule("")
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
                <div className="space-y-3">
                  {ruleFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name={`rules.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Enter a rule or guideline..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {ruleFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRule(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Event Schedule</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSchedule({ time: "", event: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {scheduleFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.time`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="e.g., March 1, 9:00 AM" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.event`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="e.g., Opening Ceremony" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {scheduleFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSchedule(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/dashboard/hackathons/${hackathonId.toString()}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Hackathon"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

