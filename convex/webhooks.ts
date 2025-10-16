import { httpAction } from "./_generated/server";
import { Webhooks } from "@octokit/webhooks";

export const githubWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Missing GITHUB_WEBHOOK_SECRET", { status: 500 });
  }

  // Read raw body for signature verification
  const body = await request.text();

  const id = request.headers.get("x-github-delivery") ?? "";
  const name = request.headers.get("x-github-event") ?? "";
  const signature256 = request.headers.get("x-hub-signature-256") ?? "";

  const webhooks = new Webhooks({ secret });

  let extracted: {
    issueUrl: string;
    issueNumber: number;
    openedBy: string;
    body: string | null;
    title: string;
  } | null = null;

  webhooks.on("issues.opened", async (event) => {
    const issueUrl = event.payload.issue.html_url ?? event.payload.issue.url;
    const issueNumber = event.payload.issue.number;
    const eventBody = event.payload.issue.body;
    const eventTitle = event.payload.issue.title;
    const openedBy =
      event.payload.issue.user?.login ?? event.payload.sender.login;
    extracted = {
      issueUrl,
      issueNumber,
      openedBy,
      body: eventBody,
      title: eventTitle,
    };
  });

  try {
    await webhooks.verifyAndReceive({
      id,
      name,
      payload: body,
      signature: signature256,
    });
  } catch (err) {
    return new Response("Invalid signature or payload", { status: 400 });
  }
  console.log(extracted);
  if (extracted) {
    return new Response(null, { status: 200 });
  }

  return new Response("OK");
});
