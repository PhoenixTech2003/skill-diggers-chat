import { httpAction } from "./_generated/server";

export const githubWebhook = httpAction(async (ctx, request) => {
  const data = await request.json();
  console.log(data);
  return new Response("OK");
});
