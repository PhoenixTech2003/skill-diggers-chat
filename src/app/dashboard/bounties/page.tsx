import { BountiesKanban } from "./_components/bounties-kanban";
import { getToken } from "~/lib/auth-server";
import { redirect } from "next/navigation";

export default async function BountiesServerPage() {
  const token = await getToken();

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">My Bounties</h1>
        <p className="text-muted-foreground">
          Manage your accepted bounties and track your progress.
        </p>
      </div>

      <BountiesKanban />
    </div>
  );
}
