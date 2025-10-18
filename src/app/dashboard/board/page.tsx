import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { BoardPageClient } from "./_components/board-page-client";
import { theBoardFlag } from "~/flags";
import { redirect } from "next/navigation";

export default async function BoardPageServer() {
  const theBoard = await theBoardFlag();

  if (!theBoard) {
    redirect("/dashboard");
  }

  const preloadedIssues = await preloadQuery(
    api.issues.getOpenAndApprovedIssues,
    {},
  );

  return <BoardPageClient preloadedIssues={preloadedIssues} />;
}
