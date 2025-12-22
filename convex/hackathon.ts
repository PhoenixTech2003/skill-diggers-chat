import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getHackathons = query({
    args:{paginationOpts: paginationOptsValidator},
    handler: async (ctx, args)=>{
        const hackathons = await ctx.db.query("hackathons").order("desc").paginate(args.paginationOpts);
        return hackathons;
    }
})