"use client"

import { Card, CardContent } from "~/components/ui/card"
import { CheckCircle } from "lucide-react"

interface StatusBannerProps {
  resultsPublished: boolean
}

export function StatusBanner({ resultsPublished }: StatusBannerProps) {
  if (!resultsPublished) {
    return null
  }

  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium">Results Published Successfully</p>
            <p className="text-sm text-muted-foreground">
              Winners have been notified and certificates are available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

