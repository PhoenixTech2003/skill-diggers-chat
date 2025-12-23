import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { components } from "./_generated/api";

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

// Helper function to check if user is admin
async function checkAdmin(ctx: any): Promise<boolean> {
    try {
        const user = await authComponent.getAuthUser(ctx);
        if (!user?._id) {
            return false;
        }
        return user.role === "admin";
    } catch {
        return false;
    }
}

export const submitDeliverables = mutation({
    args: {
        hackathonId: v.id("hackathons"),
        liveLink: v.string(),
        githubLink: v.string(),
        linkedInPosts: v.array(v.string()),
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

        // Check if hackathon is in-progress
        if (hackathon.status !== "in-progress") {
            throw new Error("Submissions are only accepted during in-progress hackathons");
        }

        // Check if user is registered
        const registration = await ctx.db
            .query("hackathonRegistrations")
            .withIndex("by_hackathon_user", (q) => 
                q.eq("hackathonId", args.hackathonId).eq("userId", user._id)
            )
            .first();

        if (!registration) {
            throw new Error("You must be registered for this hackathon to submit deliverables");
        }

        // Validate LinkedIn posts if required
        if (hackathon.requireLinkedIn && hackathon.linkedInPostsRequired) {
            if (args.linkedInPosts.length < hackathon.linkedInPostsRequired) {
                throw new Error(`At least ${hackathon.linkedInPostsRequired} LinkedIn post(s) are required`);
            }
        }

        // Check if submission already exists
        const existingSubmission = await ctx.db
            .query("hackathonSubmissions")
            .withIndex("by_registration", (q) => q.eq("registrationId", registration._id))
            .first();

        if (existingSubmission) {
            // Update existing submission
            await ctx.db.patch(existingSubmission._id, {
                liveLink: args.liveLink,
                githubLink: args.githubLink,
                linkedInPosts: args.linkedInPosts,
                submittedAt: Date.now(),
            });
            return existingSubmission._id;
        } else {
            // Create new submission
            const submissionId = await ctx.db.insert("hackathonSubmissions", {
                hackathonId: args.hackathonId,
                registrationId: registration._id,
                liveLink: args.liveLink,
                githubLink: args.githubLink,
                linkedInPosts: args.linkedInPosts,
                submittedAt: Date.now(),
            });
            return submissionId;
        }
    },
})

export const getUserSubmission = query({
    args: { hackathonId: v.id("hackathons") },
    handler: async (ctx, args) => {
        try {
            const user = await authComponent.getAuthUser(ctx);
            if (!user?._id) {
                return null;
            }

            // Get user's registration
            const registration = await ctx.db
                .query("hackathonRegistrations")
                .withIndex("by_hackathon_user", (q) => 
                    q.eq("hackathonId", args.hackathonId).eq("userId", user._id)
                )
                .first();

            if (!registration) {
                return null;
            }

            // Get submission
            const submission = await ctx.db
                .query("hackathonSubmissions")
                .withIndex("by_registration", (q) => q.eq("registrationId", registration._id))
                .first();

            return submission;
        } catch {
            return null;
        }
    },
})

export const getHackathonSubmissions = query({
    args: { hackathonId: v.id("hackathons") },
    handler: async (ctx, args) => {
        // Check admin access
        const isAdmin = await checkAdmin(ctx);
        if (!isAdmin) {
            throw new Error("Unauthorized - Admin access required");
        }

        // Get all submissions for this hackathon
        const submissions = await ctx.db
            .query("hackathonSubmissions")
            .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
            .collect();

        // Enrich with registration and team member data
        const enrichedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                const registration = await ctx.db.get(submission.registrationId);
                if (!registration) {
                    return null;
                }

                // Get team members if it's a team registration
                let teamMembers: string[] = [];
                if (registration.registrationType === "team") {
                    const members = await ctx.db
                        .query("hackathonTeamMembers")
                        .withIndex("by_registration", (q: any) => q.eq("registrationId", registration._id))
                        .collect();
                    // Fetch user names for each team member
                    const memberNames = await Promise.all(
                        members.map(async (m) => {
                            try {
                                const userData = await ctx.runQuery(
                                    components.betterAuth.users.getUser,
                                    { userId: m.userId }
                                ) as any;
                                return userData?.userData?.name || userData?.userData?.email || m.userId;
                            } catch {
                                return m.userId;
                            }
                        })
                    );
                    teamMembers = memberNames;
                } else {
                    // For individual, fetch user name
                    try {
                        const userData = await ctx.runQuery(
                            components.betterAuth.users.getUser,
                            { userId: registration.userId }
                        ) as any;
                        teamMembers = [userData?.userData?.name || userData?.userData?.email || registration.userId];
                    } catch {
                        teamMembers = [registration.userId];
                    }
                }

                return {
                    ...submission,
                    teamName: registration.teamName || (registration.registrationType === "individual" ? "Individual" : "Team"),
                    type: registration.registrationType,
                    members: teamMembers,
                };
            })
        );

        // Filter out nulls
        return enrichedSubmissions.filter((s) => s !== null) as any[];
    },
})

export const getHackathonSubmissionsPaginated = query({
    args: {
        paginationOpts: paginationOptsValidator,
        hackathonId: v.id("hackathons"),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check admin access
        const isAdmin = await checkAdmin(ctx);
        if (!isAdmin) {
            throw new Error("Unauthorized - Admin access required");
        }

        const hasSearch = args.search && args.search.trim() !== "";

        if (hasSearch) {
            // Manual pagination path: collect all, filter, then paginate
            const allSubmissions = await ctx.db
                .query("hackathonSubmissions")
                .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
                .collect();

            // Enrich with registration and team member data
            const enrichedSubmissions = await Promise.all(
                allSubmissions.map(async (submission) => {
                    const registration = await ctx.db.get(submission.registrationId);
                    if (!registration) {
                        return null;
                    }

                    // Get team members if it's a team registration
                    let teamMembers: string[] = [];
                    if (registration.registrationType === "team") {
                        const members = await ctx.db
                            .query("hackathonTeamMembers")
                            .withIndex("by_registration", (q: any) => q.eq("registrationId", registration._id))
                            .collect();
                        // Fetch user names for each team member
                        const memberNames = await Promise.all(
                            members.map(async (m) => {
                                try {
                                    const userData = await ctx.runQuery(
                                        components.betterAuth.users.getUser,
                                        { userId: m.userId }
                                    ) as any;
                                    return userData?.userData?.name || userData?.userData?.email || m.userId;
                                } catch {
                                    return m.userId;
                                }
                            })
                        );
                        teamMembers = memberNames;
                    } else {
                        // For individual, fetch user name
                        try {
                            const userData = await ctx.runQuery(
                                components.betterAuth.users.getUser,
                                { userId: registration.userId }
                            ) as any;
                            teamMembers = [userData?.userData?.name || userData?.userData?.email || registration.userId];
                        } catch {
                            teamMembers = [registration.userId];
                        }
                    }

                    return {
                        ...submission,
                        teamName: registration.teamName || (registration.registrationType === "individual" ? "Individual" : "Team"),
                        type: registration.registrationType,
                        members: teamMembers,
                    };
                })
            );

            // Filter out nulls
            const validSubmissions = enrichedSubmissions.filter((s) => s !== null) as any[];

            // Apply search filter (server-side filtering)
            const searchLower = args.search!.toLowerCase().trim();
            const filteredSubmissions = validSubmissions.filter((submission) => {
                const teamNameMatch = submission.teamName.toLowerCase().includes(searchLower);
                const memberMatch = submission.members.some((member: string) =>
                    member.toLowerCase().includes(searchLower)
                );
                return teamNameMatch || memberMatch;
            });

            // Sort by submission time (descending) - most recent first
            filteredSubmissions.sort((a, b) => b.submittedAt - a.submittedAt);

            // Manual pagination
            const { numItems, cursor } = args.paginationOpts;
            let startIndex = 0;

            if (cursor) {
                // Find the index of the cursor submission by ID
                const cursorId = cursor;
                const cursorIndex = filteredSubmissions.findIndex((s) => {
                    return s._id.toString() === cursorId || s._id === cursorId;
                });
                if (cursorIndex !== -1) {
                    startIndex = cursorIndex + 1;
                }
            }

            const endIndex = startIndex + numItems;
            const page = filteredSubmissions.slice(startIndex, endIndex);
            const hasMore = endIndex < filteredSubmissions.length;

            return {
                page,
                continueCursor: hasMore && page.length > 0 ? page[page.length - 1]!._id.toString() : (null as any),
                isDone: !hasMore,
            };
        } else {
            // Standard pagination path: use paginate()
            const result = await ctx.db
                .query("hackathonSubmissions")
                .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
                .order("desc")
                .paginate(args.paginationOpts);

            // Enrich with registration and team member data
            const enrichedSubmissions = await Promise.all(
                result.page.map(async (submission) => {
                    const registration = await ctx.db.get(submission.registrationId);
                    if (!registration) {
                        return null;
                    }

                    // Get team members if it's a team registration
                    let teamMembers: string[] = [];
                    if (registration.registrationType === "team") {
                        const members = await ctx.db
                            .query("hackathonTeamMembers")
                            .withIndex("by_registration", (q: any) => q.eq("registrationId", registration._id))
                            .collect();
                        // Fetch user names for each team member
                        const memberNames = await Promise.all(
                            members.map(async (m) => {
                                try {
                                    const userData = await ctx.runQuery(
                                        components.betterAuth.users.getUser,
                                        { userId: m.userId }
                                    ) as any;
                                    return userData?.userData?.name || userData?.userData?.email || m.userId;
                                } catch {
                                    return m.userId;
                                }
                            })
                        );
                        teamMembers = memberNames;
                    } else {
                        // For individual, fetch user name
                        try {
                            const userData = await ctx.runQuery(
                                components.betterAuth.users.getUser,
                                { userId: registration.userId }
                            ) as any;
                            teamMembers = [userData?.userData?.name || userData?.userData?.email || registration.userId];
                        } catch {
                            teamMembers = [registration.userId];
                        }
                    }

                    return {
                        ...submission,
                        teamName: registration.teamName || (registration.registrationType === "individual" ? "Individual" : "Team"),
                        type: registration.registrationType,
                        members: teamMembers,
                    };
                })
            );

            // Filter out nulls
            const validSubmissions = enrichedSubmissions.filter((s) => s !== null) as any[];

            return {
                page: validSubmissions,
                continueCursor: result.continueCursor ? result.continueCursor.toString() : (null as any),
                isDone: result.isDone,
            };
        }
    },
})

export const updateSubmissionPosition = mutation({
    args: {
        submissionId: v.id("hackathonSubmissions"),
        position: v.optional(v.union(
            v.literal("1st Place"),
            v.literal("2nd Place"),
            v.literal("3rd Place"),
            v.literal("Honorable Mention")
        )),
    },
    handler: async (ctx, args) => {
        // Check admin access
        const isAdmin = await checkAdmin(ctx);
        if (!isAdmin) {
            throw new Error("Unauthorized - Admin access required");
        }

        const submission = await ctx.db.get(args.submissionId);
        if (!submission) {
            throw new Error("Submission not found");
        }

        // Check if results are already published
        if (submission.resultsPublished) {
            throw new Error("Cannot update position after results are published");
        }

        await ctx.db.patch(args.submissionId, {
            position: args.position || undefined,
        });

        return args.submissionId;
    },
})

export const publishHackathonResults = mutation({
    args: { hackathonId: v.id("hackathons") },
    handler: async (ctx, args) => {
        // Check admin access
        const isAdmin = await checkAdmin(ctx);
        if (!isAdmin) {
            throw new Error("Unauthorized - Admin access required");
        }

        // Get all submissions with positions
        const submissions = await ctx.db
            .query("hackathonSubmissions")
            .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
            .collect();

        const submissionsWithPositions = submissions.filter((s) => s.position);

        if (submissionsWithPositions.length === 0) {
            throw new Error("No submissions with assigned positions to publish");
        }

        // Update all submissions with positions to mark as published
        for (const submission of submissionsWithPositions) {
            await ctx.db.patch(submission._id, {
                resultsPublished: true,
            });
        }

        return { published: submissionsWithPositions.length };
    },
})

export const getHackathonWinners = query({
    args: { hackathonId: v.id("hackathons") },
    handler: async (ctx, args) => {
        // Get all published submissions with positions
        const submissions = await ctx.db
            .query("hackathonSubmissions")
            .withIndex("by_hackathon", (q) => q.eq("hackathonId", args.hackathonId))
            .collect();

        const winners = submissions.filter(
            (s) => s.resultsPublished && s.position
        );

        // Enrich with registration and team member data
        const enrichedWinners = await Promise.all(
            winners.map(async (submission) => {
                const registration = await ctx.db.get(submission.registrationId);
                if (!registration) {
                    return null;
                }

                // Get team members
                let teamMembers: string[] = [];
                if (registration.registrationType === "team") {
                    const members = await ctx.db
                        .query("hackathonTeamMembers")
                        .withIndex("by_registration", (q: any) => q.eq("registrationId", registration._id))
                        .collect();
                    // Fetch user names for each team member
                    const memberNames = await Promise.all(
                        members.map(async (m) => {
                            try {
                                const userData = await ctx.runQuery(
                                    components.betterAuth.users.getUser,
                                    { userId: m.userId }
                                ) as any;
                                return userData?.userData?.name || userData?.userData?.email || m.userId;
                            } catch {
                                return m.userId;
                            }
                        })
                    );
                    teamMembers = memberNames;
                } else {
                    // For individual, fetch user name
                    try {
                        const userData = await ctx.runQuery(
                            components.betterAuth.users.getUser,
                            { userId: registration.userId }
                        ) as any;
                        teamMembers = [userData?.userData?.name || userData?.userData?.email || registration.userId];
                    } catch {
                        teamMembers = [registration.userId];
                    }
                }

                return {
                    ...submission,
                    teamName: registration.teamName || (registration.registrationType === "individual" ? "Individual" : "Team"),
                    members: teamMembers,
                    projectName: submission.liveLink, // Use live link as project identifier
                };
            })
        );

        // Filter out nulls and sort by position
        const validWinners = enrichedWinners.filter((w) => w !== null) as any[];
        
        // Sort by position priority
        const positionOrder: Record<string, number> = {
            "1st Place": 1,
            "2nd Place": 2,
            "3rd Place": 3,
            "Honorable Mention": 4,
        };

        validWinners.sort((a, b) => {
            const aOrder = positionOrder[a.position!] || 999;
            const bOrder = positionOrder[b.position!] || 999;
            return aOrder - bOrder;
        });

        return validWinners;
    },
})

export const updateHackathon = mutation({
    args: {
        hackathonId: v.id("hackathons"),
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
        // Check admin access
        const isAdmin = await checkAdmin(ctx);
        if (!isAdmin) {
            throw new Error("Unauthorized - Admin access required");
        }

        // Check if hackathon exists
        const hackathon = await ctx.db.get(args.hackathonId);
        if (!hackathon) {
            throw new Error("Hackathon not found");
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

        // Update hackathon
        await ctx.db.patch(args.hackathonId, {
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
            updatedAt: Date.now(),
        });

        return args.hackathonId;
    },
})