"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import GoogleIcon from "./google-icon";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // Simulate Google OAuth process
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <Card className="w-full border border-white/10 bg-transparent">
      <CardHeader className="space-y-1">
        <CardTitle className="text-card-foreground text-center text-2xl">
          Sign In
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Continue with your Google account to join Skill Diggers
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            className="h-12 w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            disabled={isLoading}
          >
            <GoogleIcon className="mr-3 h-5 w-5" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
