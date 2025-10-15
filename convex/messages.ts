import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { components } from "./_generated/api";

export const sendMessage = mutation({
  args: {
    roomId: v.id("room"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userData = await authComponent.getAuthUser(ctx);
      await ctx.db.insert("message", {
        roomId: args.roomId,
        userId: userData._id,
        content: args.content,
        isLastMessage: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const getRoomMessages = query({
  args: {
    roomId: v.id("room"),
  },
  handler: async (ctx, args) => {
    try {
      const messages = await ctx.db.query("message").collect();
      const filteredMessagesForTheRoom = messages.filter(
        (q) => q.roomId === args.roomId,
      );
      const formattedMessages = await Promise.all(
        filteredMessagesForTheRoom.map(async (message) => {
          type UserDetail = {
            userData?: {
              name?: string | null;
              image?: string | null;
              role: string;
            };
          };
          const userDetail = (await ctx.runQuery(
            components.betterAuth.users.getUser,
            { userId: message.userId },
          )) as unknown as UserDetail;
          return {
            ...message,
            username: userDetail.userData?.name ?? null,
            image: userDetail.userData?.image ?? null,
            role: userDetail.userData?.role,
          };
        }),
      );

      return { messagesData: formattedMessages, messagesDataError: null };
    } catch (error) {
      console.error(error);
      return {
        messagesData: null,
        messagesDataError: "Failed to get room messages",
      };
    }
  },
});
