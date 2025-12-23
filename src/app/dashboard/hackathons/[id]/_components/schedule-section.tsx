import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { CalendarPlus } from "lucide-react"
import { addToGoogleCalendar } from "./utils"
import type { HackathonData } from "./types"

interface ScheduleSectionProps {
  hackathon: HackathonData
}

export function ScheduleSection({ hackathon }: ScheduleSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Event Schedule</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addToGoogleCalendar(hackathon)}
            className="gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            Add to Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hackathon.schedule?.map((item: { time: string; event: string }, index: number) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {index < hackathon.schedule!.length - 1 && <div className="w-px h-full bg-border mt-1" />}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-sm">{item.time}</p>
                <p className="text-muted-foreground text-sm">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

