import { components, api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { Webhooks } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";

export const githubWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks] Missing GITHUB_WEBHOOK_SECRET");
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

      // Try to use email from payload first (often null)
      let openedByEmail: string | null =
        event.payload.issue.user?.email ?? null;
      const openedByLogin =
        event.payload.issue.user?.login ?? event.payload.sender.login;

      if (!openedByEmail) {
        try {
          const octokit = new Octokit();
          const { data } = await octokit.rest.users.getByUsername({
            username: openedByLogin,
          });
          openedByEmail = data.email ?? null;
          console.log("[webhooks] Octokit fetched email", {
            openedByLogin,
            openedByEmail,
          });
        } catch (e) {
          console.error("[webhooks] Octokit users.getByUsername failed", {
            openedByLogin,
            error: e,
          });
          errorStatus = 502;
          errorMessage = "Failed to fetch user details from GitHub";
          return;
        }
      }

      if (!openedByEmail) {
        console.error("[webhooks] Email not available after Octokit lookup", {
          issueNumber,
          repo: event.payload.repository.full_name,
          sender: openedByLogin,
        });
        errorStatus = 404;
        errorMessage = "User email not available";
        return;
      }

      const userdata = await ctx.runQuery(
        components.betterAuth.users.getUserByEmail,
        { email: openedByEmail },
      );
      if (userdata.userDataError) {
        console.error("[webhooks] User lookup error", {
          email: openedByEmail,
          error: userdata.userDataError,
        });
        errorStatus = 500;
        errorMessage = userdata.userDataError;
        return;
      }
      if (!userdata.userData) {
        console.error("[webhooks] User not found", { email: openedByEmail });
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
      console.error("[webhooks] Handler error while creating issue", e);
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
    console.error("[webhooks] Invalid signature or payload", {
      id,
      name,
      hasSignature: Boolean(signature256),
      error: err,
    });
    return new Response("Invalid signature or payload", { status: 400 });
  }

  if (errorStatus !== null) {
    console.error("[webhooks] Completed with error", {
      id,
      name,
      status: errorStatus,
      message: errorMessage,
    });
    return new Response(errorMessage ?? "Webhook error", {
      status: errorStatus,
    });
  }
  if (handled) {
    console.log("[webhooks] issues.opened handled successfully", { id, name });
    return new Response(null, { status: 200 });
  }

  console.log("[webhooks] Event ignored", { id, name });
  return new Response("Event ignored", { status: 200 });
});
