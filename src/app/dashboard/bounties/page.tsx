import { BountiesKanban } from "./_components/bounties-kanban";
import { CompletedBounties } from "./_components/completed-bounties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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

      <Tabs defaultValue="building" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="building">Building</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="building">
          <BountiesKanban />
        </TabsContent>
        <TabsContent value="completed">
          <CompletedBounties />
        </TabsContent>
      </Tabs>
    </div>
  );
}
