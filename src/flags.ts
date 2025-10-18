import { flag } from "flags/next";
import { getToken } from "./lib/auth-server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../convex/_generated/api";

export const theBoardFlag = flag({
  key: "The Board",
  identify: async () => {
    const token = await getToken();
    const sessionData = await fetchQuery(
      api.users.getLoggedUserSession,
      {},
      { token },
    );
    return sessionData;
  },
  decide({ entities }) {
    return (
      entities?.sessionData?.user.email === "phoenixtech2003@gmail.com" ||
      entities?.sessionData?.user.email === "johsam.web@gmail.com" ||
      entities?.sessionData?.user.email === "bis23-lmwase@mubas.ac.mw"
    );
  },
});
