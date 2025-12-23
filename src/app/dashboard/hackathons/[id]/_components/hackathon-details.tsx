"use client"
import { useState } from "react"
import { usePreloadedQuery, useMutation } from "convex/react"
import { type Preloaded } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { toast } from "sonner"
import { Separator } from "~/components/ui/separator"
import { HeaderSection } from "./header-section"
import { KeyInfoGrid } from "./key-info-grid"
import { WinnersSection } from "./winners-section"
import { AboutSection } from "./about-section"
import { RulesSection } from "./rules-section"
import { ScheduleSection } from "./schedule-section"
import { NeedHelpCard } from "./need-help-card"
import { PrizePoolCard } from "./prize-pool-card"
import { RegistrationCTACard } from "./registration-cta-card"
import { SubmitDeliverablesCard } from "./submit-deliverables-card"
import { AdminActionsCard } from "./admin-actions-card"
import { RegistrationDialog } from "./registration-dialog"
import type { HackathonData } from "./types"

interface HackathonDetailsProps {
  preloadedHackathon: Preloaded<typeof api.hackathon.getHackathonById>
  isAdmin: boolean
}

export function HackathonDetails({ preloadedHackathon, isAdmin }: HackathonDetailsProps) {
  const hackathonData = usePreloadedQuery(preloadedHackathon)
  const registerForHackathonMutation = useMutation(api.hackathon.registerForHackathon)

  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)
  const [registrationType, setRegistrationType] = useState<"individual" | "team">("individual")
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<string[]>([""])
  const [isRegistering, setIsRegistering] = useState(false)

  if (!hackathonData || !hackathonData._id) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Hackathon not found</h2>
          <p className="text-muted-foreground">The hackathon you're looking for doesn't exist</p>
        </div>
      </div>
    )
  }

  const hackathon = hackathonData
  const isRegistered = hackathonData.isRegistered ?? false
  const isWinner = false // TODO: Check if user is a winner from submissions

  const isRegistrationOpen = hackathon.status === "open"
  const isInProgress = hackathon.status === "in-progress"
  const isCompleted = hackathon.status === "completed"
  const registrationEndDate = new Date(hackathon.registrationEnd)
  const hackathonEndDate = new Date(hackathon.hackathonEnd)
  
  // Ensure dates are valid for countdown
  const now = new Date()
  const showRegistrationCountdown = isRegistrationOpen && registrationEndDate > now
  const showHackathonCountdown = isInProgress && hackathonEndDate > now

  const downloadCertificate = (type: "winner" | "participant", place?: string) => {
    console.log(`Downloading ${type} certificate${place ? ` for ${place}` : ""}`)
    // In real app, this would generate and download PDF
  }

  const shareCertificate = (type: "winner" | "participant", place?: string) => {
    const text =
      type === "winner" ? `I won ${place} at ${hackathon.title}! 🏆` : `I participated in ${hackathon.title}! 🎮`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const handleRegistration = async () => {
    if (!hackathon) return

    setIsRegistering(true)
    try {
      const teamMembersList = registrationType === "team" 
        ? teamMembers.filter((m) => m.trim() !== "") 
        : undefined

      await registerForHackathonMutation({
        hackathonId: hackathon._id,
        registrationType,
        teamName: registrationType === "team" && teamName ? teamName : undefined,
        teamMembers: teamMembersList,
      })

      toast.success("Successfully registered for the hackathon!")
      setShowRegistrationDialog(false)
      // Reset form
      setRegistrationType("individual")
      setTeamName("")
      setTeamMembers([""])
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to register. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""])
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, value: string) => {
    const newMembers = [...teamMembers]
    newMembers[index] = value
    setTeamMembers(newMembers)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <HeaderSection
        hackathon={hackathon}
        showRegistrationCountdown={showRegistrationCountdown}
        showHackathonCountdown={showHackathonCountdown}
        registrationEndDate={registrationEndDate}
        hackathonEndDate={hackathonEndDate}
      />

      <Separator />

      <KeyInfoGrid hackathon={hackathon} />

      {isCompleted && (
        <WinnersSection
          hackathon={hackathon}
          isWinner={isWinner}
          onDownloadCertificate={downloadCertificate}
          onShareCertificate={shareCertificate}
        />
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <AboutSection hackathon={hackathon} />
          <RulesSection hackathon={hackathon} />
          <ScheduleSection hackathon={hackathon} />
          <NeedHelpCard />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <PrizePoolCard hackathon={hackathon} />

          {!isCompleted && (
            <RegistrationCTACard
              hackathon={hackathon}
              isRegistrationOpen={isRegistrationOpen}
              isRegistered={isRegistered}
              onRegisterClick={() => setShowRegistrationDialog(true)}
            />
          )}

          {isInProgress && isRegistered && <SubmitDeliverablesCard hackathon={hackathon} />}

          {isAdmin && <AdminActionsCard hackathonId={hackathon._id} />}
        </div>
      </div>

      <RegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        hackathon={hackathon}
        registrationType={registrationType}
        onRegistrationTypeChange={setRegistrationType}
        teamName={teamName}
        onTeamNameChange={setTeamName}
        teamMembers={teamMembers}
        onAddTeamMember={addTeamMember}
        onRemoveTeamMember={removeTeamMember}
        onUpdateTeamMember={updateTeamMember}
        isRegistering={isRegistering}
        onRegister={handleRegistration}
      />
    </div>
  )
}
