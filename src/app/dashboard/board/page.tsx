import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { BoardPageClient } from "./_components/board-page-client";

export default async function BoardPageServer() {
  const preloadedIssues = await preloadQuery(
    api.issues.getOpenAndApprovedIssues,
    {},
  );

  return <BoardPageClient preloadedIssues={preloadedIssues} />;
}
