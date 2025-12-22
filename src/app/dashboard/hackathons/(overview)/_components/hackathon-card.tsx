"use client"

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Calendar, Users, Clock, MapPin } from "lucide-react"

interface Hackathon {
  id: string
  title: string
  description: string
  registrationStart: string
  registrationEnd: string
  hackathonStart: string
  hackathonEnd: string
  participants: number
  maxParticipants: number
  status: string
  location: string
  prize: string
  requiresLinkedInPosts?: boolean
  linkedInPostsRequired?: number
}

interface HackathonCardProps {
  hackathon: Hackathon
  getStatusColor: (status: string) => string
}

export function HackathonCard({ hackathon, getStatusColor }: HackathonCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{hackathon.title}</CardTitle>
          <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Registration: {new Date(hackathon.registrationStart).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} -{" "}
              {new Date(hackathon.registrationEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Event: {new Date(hackathon.hackathonStart).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} -{" "}
              {new Date(hackathon.hackathonEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hackathon.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {hackathon.participants} / {hackathon.maxParticipants} participants
            </span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm font-semibold">
            Prize Pool: <span className="text-primary">{hackathon.prize}</span>
          </p>
          {hackathon.status === "in-progress" && (
            <p className="text-sm font-semibold">
              LinkedIn Posts Required:{" "}
              <span className="text-primary">{hackathon.linkedInPostsRequired}</span>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full" asChild>
          <Link href={`/dashboard/hackathons/${hackathon.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

