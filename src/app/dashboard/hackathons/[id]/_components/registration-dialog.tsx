"use client"

import { Button } from "~/components/ui/button"
import { Loader2, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import type { HackathonData } from "./types"

interface RegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hackathon: HackathonData
  registrationType: "individual" | "team"
  onRegistrationTypeChange: (type: "individual" | "team") => void
  teamName: string
  onTeamNameChange: (name: string) => void
  teamMembers: string[]
  onAddTeamMember: () => void
  onRemoveTeamMember: (index: number) => void
  onUpdateTeamMember: (index: number, value: string) => void
  isRegistering: boolean
  onRegister: () => void
}

export function RegistrationDialog({
  open,
  onOpenChange,
  hackathon,
  registrationType,
  onRegistrationTypeChange,
  teamName,
  onTeamNameChange,
  teamMembers,
  onAddTeamMember,
  onRemoveTeamMember,
  onUpdateTeamMember,
  isRegistering,
  onRegister,
}: RegistrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register for {hackathon.title}</DialogTitle>
          <DialogDescription>Complete your registration details to participate in this hackathon.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Registration Type */}
          {hackathon.allowTeams && (
            <div className="space-y-3">
              <Label>Registration Type</Label>
              <RadioGroup value={registrationType} onValueChange={(value: any) => onRegistrationTypeChange(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal cursor-pointer">
                    Individual - Compete solo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="font-normal cursor-pointer">
                    Team - Compete with a team
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Team Details */}
          {registrationType === "team" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => onTeamNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Team Members (Email Addresses)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={onAddTeamMember}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Member ${index + 1} email`}
                        type="email"
                        value={member}
                        onChange={(e) => onUpdateTeamMember(index, e.target.value)}
                      />
                      {teamMembers.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveTeamMember(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Registration Summary */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h4 className="font-semibold text-sm">Registration Summary</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Hackathon:</span> {hackathon.title}
              </p>
              <p>
                <span className="font-medium text-foreground">Type:</span>{" "}
                {registrationType === "team" ? `Team (${teamName || "Unnamed"})` : "Individual"}
              </p>
              <p>
                <span className="font-medium text-foreground">Registration Period:</span>{" "}
                {new Date(hackathon.registrationStart).toLocaleDateString()} -{" "}
                {new Date(hackathon.registrationEnd).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-foreground">Event Dates:</span>{" "}
                {new Date(hackathon.hackathonStart).toLocaleDateString()} -{" "}
                {new Date(hackathon.hackathonEnd).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRegistering}>
            Cancel
          </Button>
          <Button onClick={onRegister} disabled={isRegistering}>
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

