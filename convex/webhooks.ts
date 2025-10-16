import { components, api } from "./_generated/api";
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

  //web hook implemenation that handles the issues.opened event
  webhooks.on("issues.opened", async (event) => {
    const issueUrl = event.payload.issue.html_url ?? event.payload.issue.url;
    const issueNumber = event.payload.issue.number;
    const eventBody = event.payload.issue.body;
    const eventTitle = event.payload.issue.title;
    const openedByEmail =
      event.payload.issue.user?.email ?? event.payload.sender.email;
    const openedBy =
      event.payload.issue.user?.login ?? event.payload.sender.login;
    if (!openedByEmail) {
      return new Response("Missing email", { status: 400 });
    }
    const userdata = await ctx.runQuery(
      components.betterAuth.users.getUserByEmail,
      { email: openedByEmail },
    );
    if (userdata.userDataError) {
      return new Response(userdata.userDataError, { status: 500 });
    }
    if (!userdata.userData) {
      return new Response("User not found", { status: 404 });
    }
    await ctx.runMutation(api.issues.createIssue, {
      issueUrl,
      points: 0,
      issueNumber,
      openedBy: userdata.userData._id,
      body: eventBody ?? "",
      title: eventTitle,
    });
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

  return new Response("Webhook received", { status: 200 });
});
