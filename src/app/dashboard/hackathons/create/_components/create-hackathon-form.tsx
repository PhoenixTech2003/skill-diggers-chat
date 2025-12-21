"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ArrowLeft, Calendar, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { Switch } from "~/components/ui/switch"

export function CreateHackathonForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    registrationStart: "",
    registrationEnd: "",
    hackathonStart: "",
    hackathonEnd: "",
    location: "",
    maxParticipants: "",
    prize: "",
    requireLinkedIn: false,
    linkedInPostsRequired: "1",
    prizeType: "cash" as "cash" | "points",
    allowTeams: false, // Added allowTeams field to enable/disable team submissions
  })

  const [rules, setRules] = useState<string[]>([""])
  const [prizes, setPrizes] = useState<{ place: string; amount: string }[]>([{ place: "", amount: "" }])
  const [schedule, setSchedule] = useState<{ time: string; event: string }[]>([{ time: "", event: "" }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Creating hackathon:", { ...formData, rules, prizes, schedule })
    setIsSubmitting(false)
    router.push("/dashboard/hackathons")
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRule = () => setRules([...rules, ""])
  const removeRule = (index: number) => setRules(rules.filter((_, i) => i !== index))
  const updateRule = (index: number, value: string) => {
    const newRules = [...rules]
    newRules[index] = value
    setRules(newRules)
  }

  const addPrize = () => setPrizes([...prizes, { place: "", amount: "" }])
  const removePrize = (index: number) => setPrizes(prizes.filter((_, i) => i !== index))
  const updatePrize = (index: number, field: "place" | "amount", value: string) => {
    const newPrizes = [...prizes]
    const item = newPrizes[index]
    if (item) {
      item[field] = value
      setPrizes(newPrizes)
    }
  }

  const addScheduleItem = () => setSchedule([...schedule, { time: "", event: "" }])
  const removeScheduleItem = (index: number) => setSchedule(schedule.filter((_, i) => i !== index))
  const updateScheduleItem = (index: number, field: "time" | "event", value: string) => {
    const newSchedule = [...schedule]
    const item = newSchedule[index]
    if (item) {
      item[field] = value
      setSchedule(newSchedule)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/hackathons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-balance">Create Hackathon</h1>
          <p className="text-muted-foreground">Set up a new hackathon event for the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hackathon Details</CardTitle>
            <CardDescription>Fill in the information about your hackathon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Hackathon Title</Label>
              <Input
                id="title"
                placeholder="e.g., AI Innovation Challenge 2024"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                placeholder="A brief one-line description of the hackathon..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                placeholder="Provide a detailed description about what participants will be building, the goals of the hackathon, resources available, etc..."
                value={formData.fullDescription}
                onChange={(e) => handleChange("fullDescription", e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="registrationStart">Registration Start Date</Label>
                <div className="relative">
                  <Input
                    id="registrationStart"
                    type="date"
                    value={formData.registrationStart}
                    onChange={(e) => handleChange("registrationStart", e.target.value)}
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationEnd">Registration End Date</Label>
                <div className="relative">
                  <Input
                    id="registrationEnd"
                    type="date"
                    value={formData.registrationEnd}
                    onChange={(e) => handleChange("registrationEnd", e.target.value)}
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hackathonStart">Hackathon Start Date</Label>
                <div className="relative">
                  <Input
                    id="hackathonStart"
                    type="date"
                    value={formData.hackathonStart}
                    onChange={(e) => handleChange("hackathonStart", e.target.value)}
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hackathonEnd">Hackathon End Date</Label>
                <div className="relative">
                  <Input
                    id="hackathonEnd"
                    type="date"
                    value={formData.hackathonEnd}
                    onChange={(e) => handleChange("hackathonEnd", e.target.value)}
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select onValueChange={(value) => handleChange("location", value)} required>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange("maxParticipants", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize">Total Prize Pool</Label>
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={formData.prizeType === "cash" ? "default" : "outline"}
                  onClick={() => handleChange("prizeType", "cash")}
                  className="flex-1"
                >
                  Cash Prizes
                </Button>
                <Button
                  type="button"
                  variant={formData.prizeType === "points" ? "default" : "outline"}
                  onClick={() => handleChange("prizeType", "points")}
                  className="flex-1"
                >
                  Points Prizes
                </Button>
              </div>
              <Input
                id="prize"
                placeholder={formData.prizeType === "cash" ? "e.g., $10,000" : "e.g., 10,000 points"}
                value={formData.prize}
                onChange={(e) => handleChange("prize", e.target.value)}
                required
              />
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireLinkedIn">LinkedIn Post Requirement</Label>
                  <p className="text-sm text-muted-foreground">
                    Require participants to provide links to LinkedIn posts
                  </p>
                </div>
                <Switch
                  id="requireLinkedIn"
                  checked={formData.requireLinkedIn}
                  onCheckedChange={(checked) => handleChange("requireLinkedIn", checked)}
                />
              </div>

              {formData.requireLinkedIn && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="linkedInPostsRequired">Number of LinkedIn Posts Required</Label>
                  <Input
                    id="linkedInPostsRequired"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="e.g., 1"
                    value={formData.linkedInPostsRequired}
                    onChange={(e) => handleChange("linkedInPostsRequired", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Participants will need to submit {formData.linkedInPostsRequired} LinkedIn post link
                    {formData.linkedInPostsRequired !== "1" ? "s" : ""} to complete registration
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowTeams">Allow Team Submissions</Label>
                  <p className="text-sm text-muted-foreground">Enable participants to register and compete as teams</p>
                </div>
                <Switch
                  id="allowTeams"
                  checked={formData.allowTeams}
                  onCheckedChange={(checked) => handleChange("allowTeams", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Prize Breakdown</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPrize}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prize
                </Button>
              </div>
              <div className="space-y-3">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Input
                      placeholder="e.g., 1st Place"
                      value={prize.place}
                      onChange={(e) => updatePrize(index, "place", e.target.value)}
                    />
                    <Input
                      placeholder={formData.prizeType === "cash" ? "e.g., $5,000" : "e.g., 5000 points"}
                      value={prize.amount}
                      onChange={(e) => updatePrize(index, "amount", e.target.value)}
                    />
                    {prizes.length > 1 && (
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
                <Label>Rules & Guidelines</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Input
                      placeholder="Enter a rule or guideline..."
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                    />
                    {rules.length > 1 && (
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
                <Label>Event Schedule</Label>
                <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule Item
                </Button>
              </div>
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Input
                      placeholder="e.g., March 1, 9:00 AM"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="e.g., Opening Ceremony"
                      value={item.event}
                      onChange={(e) => updateScheduleItem(index, "event", e.target.value)}
                      className="flex-1"
                    />
                    {schedule.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleItem(index)}
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
              <Link href="/dashboard/hackathons">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Hackathon"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
