import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { authComponent, createAuth } from "./auth";

export const getHackathons = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(v.union(
            v.literal("open"),
            v.literal("upcoming"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("closed")
        )),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // If we have a search query, we need to filter all results first (manual pagination)
        // Otherwise, we can use the standard paginate() method with status index
        const hasSearch = args.search && args.search.trim() !== "";
        
        if (hasSearch) {
            // Manual pagination path: collect all, filter, then paginate
            let allHackathons;
            
            if (args.status) {
                // Use status index for efficient filtering
                allHackathons = await ctx.db
                    .query("hackathons")
                    .withIndex("by_status", (q) => q.eq("status", args.status!))
                    .order("desc")
                    .collect();
            } else {
                // No status filter, get all hackathons
                allHackathons = await ctx.db
                    .query("hackathons")
                    .order("desc")
                    .collect();
            }
            
            // Apply search filter (server-side filtering)
            const searchLower = args.search!.toLowerCase().trim();
            allHackathons = allHackathons.filter((hackathon) => {
                const titleMatch = hackathon.title.toLowerCase().includes(searchLower);
                const descriptionMatch = hackathon.description.toLowerCase().includes(searchLower);
                const fullDescriptionMatch = hackathon.fullDescription.toLowerCase().includes(searchLower);
                return titleMatch || descriptionMatch || fullDescriptionMatch;
            });
            
            // Sort by creation time (descending) - ensure consistent ordering
            allHackathons.sort((a, b) => b.createdAt - a.createdAt);
            
            // Manual pagination
            const { numItems, cursor } = args.paginationOpts;
            let startIndex = 0;
            
            if (cursor) {
                // Find the index of the cursor hackathon by ID
                const cursorId = cursor;
                const cursorIndex = allHackathons.findIndex((h) => {
                    return h._id.toString() === cursorId || h._id === cursorId;
                });
                if (cursorIndex !== -1) {
                    startIndex = cursorIndex + 1;
                }
            }
            
            const endIndex = startIndex + numItems;
            const page = allHackathons.slice(startIndex, endIndex);
            const hasMore = endIndex < allHackathons.length;
            
            // Get participant counts for each hackathon
            const hackathonsWithCounts = await Promise.all(
                page.map(async (hackathon) => {
                    const registrations = await ctx.db
                        .query("hackathonRegistrations")
                        .withIndex("by_hackathon", (q) => q.eq("hackathonId", hackathon._id))
                        .collect();
                    
                    const participantCount = registrations.length;
                    
                    return {
                        ...hackathon,
                        participantCount,
                    };
                })
            );
            
            return {
                page: hackathonsWithCounts,
                continueCursor: hasMore && page.length > 0 ? page[page.length - 1]!._id.toString() : (null as any),
                isDone: !hasMore,
            };
        } else {
            // Standard pagination path: use paginate() with status index if available
            let result;
            
            if (args.status) {
                // Use status index for efficient filtering
                result = await ctx.db
                    .query("hackathons")
                    .withIndex("by_status", (q) => q.eq("status", args.status!))
                    .order("desc")
                    .paginate(args.paginationOpts);
            } else {
                // No status filter, use standard query
                result = await ctx.db
                    .query("hackathons")
                    .order("desc")
                    .paginate(args.paginationOpts);
            }
            
            // Get participant counts for each hackathon
            const hackathonsWithCounts = await Promise.all(
                result.page.map(async (hackathon) => {
                    const registrations = await ctx.db
                        .query("hackathonRegistrations")
                        .withIndex("by_hackathon", (q) => q.eq("hackathonId", hackathon._id))
                        .collect();
                    
                    const participantCount = registrations.length;
                    
                    return {
                        ...hackathon,
                        participantCount,
                    };
                })
            );
            
            return {
                page: hackathonsWithCounts,
                continueCursor: result.continueCursor ? result.continueCursor.toString() : (null as any),
                isDone: result.isDone,
            };
        }
    }
})

export const getHackathonById = query({
    args: { hackathonId: v.id("hackathons") },
    handler: async (ctx, args) => {
        const hackathon = await ctx.db.get(args.hackathonId);
        if (!hackathon) {
            return null;
        }

        // Get participant count
        const registrations = await ctx.db
            .query("hackathonRegistrations")
            .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
            .collect();

        const participantCount = registrations.length;

        // Check if current user is registered (optional - don't throw if unauthenticated)
        let isRegistered = false;
        let userRegistration = null;
        
        try {
            // Try to get user using getAuthUser, but catch any authentication errors
            const user = await authComponent.getAuthUser(ctx);
            if (user?._id) {
                userRegistration = await ctx.db
                    .query("hackathonRegistrations")
                    .withIndex("by_hackathon_user", (q) => 
                        q.eq("hackathonId", args.hackathonId).eq("userId", user._id)
                    )
                    .first();
                isRegistered = !!userRegistration;
            }
        } catch (error) {
            // User is not authenticated or any other error occurred
            // This is fine - just set isRegistered to false
            // The hackathon details should still be viewable
            isRegistered = false;
            userRegistration = null;
        }

        return {
            ...hackathon,
            participantCount,
            isRegistered,
            userRegistration,
        };
    },
})

export const createHackathon = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        fullDescription: v.string(),
        registrationStart: v.string(),
        registrationEnd: v.string(),
        hackathonStart: v.string(),
        hackathonEnd: v.string(),
        location: v.union(v.literal("virtual"), v.literal("in-person"), v.literal("hybrid")),
        maxParticipants: v.number(),
        prize: v.string(),
        prizeType: v.union(v.literal("cash"), v.literal("points")),
        requireLinkedIn: v.boolean(),
        linkedInPostsRequired: v.optional(v.number()),
        allowTeams: v.boolean(),
        rules: v.array(v.string()),
        prizes: v.array(
            v.object({
                place: v.string(),
                amount: v.string(),
            })
        ),
        schedule: v.array(
            v.object({
                time: v.string(),
                event: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // Get current user
        const user = await authComponent.getAuthUser(ctx);
        if (!user?._id) {
            throw new Error("Unauthorized");
        }

        // Calculate status based on current date and hackathon dates
        const now = Date.now();
        const registrationStart = new Date(args.registrationStart).getTime();
        const registrationEnd = new Date(args.registrationEnd).getTime();
        const hackathonStart = new Date(args.hackathonStart).getTime();
        const hackathonEnd = new Date(args.hackathonEnd).getTime();

        let status: "open" | "upcoming" | "in-progress" | "completed" | "closed";
        
        if (now < registrationStart) {
            status = "upcoming";
        } else if (now >= registrationStart && now <= registrationEnd) {
            status = "open";
        } else if (now > registrationEnd && now < hackathonStart) {
            status = "closed";
        } else if (now >= hackathonStart && now <= hackathonEnd) {
            status = "in-progress";
        } else {
            status = "completed";
        }

        const currentTime = Date.now();

        const hackathonId = await ctx.db.insert("hackathons", {
            title: args.title,
            description: args.description,
            fullDescription: args.fullDescription,
            registrationStart: args.registrationStart,
            registrationEnd: args.registrationEnd,
            hackathonStart: args.hackathonStart,
            hackathonEnd: args.hackathonEnd,
            location: args.location,
            maxParticipants: args.maxParticipants,
            prize: args.prize,
            prizeType: args.prizeType,
            status,
            requireLinkedIn: args.requireLinkedIn,
            linkedInPostsRequired: args.linkedInPostsRequired,
            allowTeams: args.allowTeams,
            rules: args.rules,
            prizes: args.prizes,
            schedule: args.schedule,
            createdBy: user._id,
            createdAt: currentTime,
            updatedAt: currentTime,
        });

        return hackathonId;
    },
})

export const registerForHackathon = mutation({
    args: {
        hackathonId: v.id("hackathons"),
        registrationType: v.union(v.literal("individual"), v.literal("team")),
        teamName: v.optional(v.string()),
        teamMembers: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx);
        if (!user?._id) {
            throw new Error("Unauthorized");
        }

        // Check if hackathon exists
        const hackathon = await ctx.db.get(args.hackathonId);
        if (!hackathon) {
            throw new Error("Hackathon not found");
        }

        // Check if registration is open
        const now = Date.now();
        const registrationStart = new Date(hackathon.registrationStart).getTime();
        const registrationEnd = new Date(hackathon.registrationEnd).getTime();

        if (now < registrationStart || now > registrationEnd) {
            throw new Error("Registration is not currently open");
        }

        // Check if user is already registered
        const existingRegistration = await ctx.db
            .query("hackathonRegistrations")
            .withIndex("by_hackathon_user", (q) => 
                q.eq("hackathonId", args.hackathonId).eq("userId", user._id)
            )
            .first();

        if (existingRegistration) {
            throw new Error("You are already registered for this hackathon");
        }

        // Check if hackathon is full
        const registrations = await ctx.db
            .query("hackathonRegistrations")
            .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
            .collect();

        if (registrations.length >= hackathon.maxParticipants) {
            throw new Error("Hackathon is full");
        }

        // Validate team registration
        if (args.registrationType === "team") {
            if (!hackathon.allowTeams) {
                throw new Error("Team registration is not allowed for this hackathon");
            }
            if (!args.teamName || args.teamName.trim() === "") {
                throw new Error("Team name is required");
            }
            if (!args.teamMembers || args.teamMembers.length === 0) {
                throw new Error("At least one team member is required");
            }
        }

        // Create registration
        const registrationId = await ctx.db.insert("hackathonRegistrations", {
            hackathonId: args.hackathonId,
            userId: user._id,
            registrationType: args.registrationType,
            teamName: args.registrationType === "team" ? args.teamName : undefined,
            registeredAt: Date.now(),
        });

        // Add team members if it's a team registration
        if (args.registrationType === "team" && args.teamMembers) {
            for (const memberEmail of args.teamMembers) {
                if (memberEmail.trim() !== "") {
                    await ctx.db.insert("hackathonTeamMembers", {
                        registrationId,
                        userId: memberEmail.trim(),
                        addedAt: Date.now(),
                    });
                }
            }
        }

        return registrationId;
    },
})