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

  let handled = false;
  let errorStatus: number | null = null;
  let errorMessage: string | null = null;

  // webhook implementation that handles the issues.opened event
  webhooks.on("issues.opened", async (event) => {
    try {
      const issueUrl = event.payload.issue.html_url ?? event.payload.issue.url;
      const issueNumber = event.payload.issue.number;
      const eventBody = event.payload.issue.body;
      const eventTitle = event.payload.issue.title;
      const openedByEmail =
        (event.payload.issue as any).user?.email ??
        (event.payload.sender as any).email;

      if (!openedByEmail) {
        errorStatus = 400;
        errorMessage = "Missing email in webhook payload";
        return;
      }

      const userdata = await ctx.runQuery(
        components.betterAuth.users.getUserByEmail,
        { email: openedByEmail },
      );
      if (userdata.userDataError) {
        errorStatus = 500;
        errorMessage = userdata.userDataError;
        return;
      }
      if (!userdata.userData) {
        errorStatus = 404;
        errorMessage = "User not found";
        return;
      }

      await ctx.runMutation(api.issues.createIssue, {
        issueUrl,
        points: 0,
        issueNumber,
        openedBy: userdata.userData._id,
        body: eventBody ?? "",
        title: eventTitle,
      });
      handled = true;
    } catch (e) {
      errorStatus = 500;
      errorMessage = "Handler error";
    }
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

  if (errorStatus !== null) {
    return new Response(errorMessage ?? "Webhook error", {
      status: errorStatus,
    });
  }
  if (handled) {
    return new Response(null, { status: 200 });
  }

  return new Response("Event ignored", { status: 200 });
});
