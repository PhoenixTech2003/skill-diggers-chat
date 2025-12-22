import  *  as z from "zod";

export const createHackathonFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    fullDescription: z.string().min(1, { message: "Full description is required" }),
    registrationStart: z.string().min(1, { message: "Registration start is required" }),
    registrationEnd: z.string().min(1, { message: "Registration end is required" }),
    hackathonStart: z.string().min(1, { message: "Hackathon start is required" }),
    hackathonEnd: z.string().min(1, { message: "Hackathon end is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    maxParticipants: z.number().min(1, { message: "Max participants is required" }),
    prize: z.string().min(1, { message: "Prize is required" }),
    prizeType: z.string().min(1, { message: "Prize type is required" }),
    allowTeams: z.boolean(),
    requireLinkedIn: z.boolean(),
    linkedInPostsRequired: z.number().min(1, { message: "LinkedIn posts required is required" }),
    rules: z.array(z.string()).min(1, { message: "Rules are required" }),
    prizes: z.array(z.object({
        place: z.string().min(1, { message: "Place is required" }),
        amount: z.string().min(1, { message: "Amount is required" }),
    })).min(1, { message: "Prizes are required" }),
    schedule: z.array(z.object({
        time: z.string().min(1, { message: "Time is required" }),
        event: z.string().min(1, { message: "Event is required" }),
    })).min(1, { message: "Schedule is required" }),
})

export type CreateHackathonFormSchema = z.infer<typeof createHackathonFormSchema>;