"use client";
import { LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    toast.promise(
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      }),
      {
        loading: "Signing out...",
        success: "Sign out was completed successfully",
        error: "Failed to sign out",
      },
    );
  };

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
