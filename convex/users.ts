import { createAuth, authComponent } from "./auth";
import { query } from "./_generated/server";

export const getLoggedUserSession = query({
  handler: async (ctx) => {
    try {
      const session = await createAuth(ctx).api.getSession({
        headers: await authComponent.getHeaders(ctx),
      });

      return { sessionData: session, sessionDataError: null };
    } catch (sessionError) {
      console.error(
        sessionError instanceof Error
          ? sessionError.message
          : "an unknown error occured while attempting to get the users session",
      );
      return {
        sessionData: null,
        sessionDataError: "Failed to get your session",
      };
    }
  },
});
