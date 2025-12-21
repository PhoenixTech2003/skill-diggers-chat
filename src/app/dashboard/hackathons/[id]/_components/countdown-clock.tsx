"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "~/components/ui/card"

interface CountdownClockProps {
  targetDate: Date
  label?: string // Added optional label prop to customize the countdown text
}

export function CountdownClock({ targetDate, label = "Registration Closes In" }: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <Card className="bg-background/50 border-primary/20 min-w-[280px]">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground text-center mb-2">{label}</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center">
            <div className="digital-clock text-3xl font-bold text-primary">{formatNumber(timeLeft.days)}</div>
            <span className="text-xs text-muted-foreground mt-1">Days</span>
          </div>
          <span className="digital-clock text-3xl font-bold text-primary">:</span>
          <div className="flex flex-col items-center">
            <div className="digital-clock text-3xl font-bold text-primary">{formatNumber(timeLeft.hours)}</div>
            <span className="text-xs text-muted-foreground mt-1">Hours</span>
          </div>
          <span className="digital-clock text-3xl font-bold text-primary">:</span>
          <div className="flex flex-col items-center">
            <div className="digital-clock text-3xl font-bold text-primary">{formatNumber(timeLeft.minutes)}</div>
            <span className="text-xs text-muted-foreground mt-1">Min</span>
          </div>
          <span className="digital-clock text-3xl font-bold text-primary">:</span>
          <div className="flex flex-col items-center">
            <div className="digital-clock text-3xl font-bold text-primary">{formatNumber(timeLeft.seconds)}</div>
            <span className="text-xs text-muted-foreground mt-1">Sec</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
