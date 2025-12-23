import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"

export function NeedHelpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Have questions about this hackathon? Contact our support team for assistance.
        </p>
        <Button variant="outline" className="w-full bg-transparent">
          Contact Support
        </Button>
      </CardContent>
    </Card>
  )
}

