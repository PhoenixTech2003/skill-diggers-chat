import * as z from "zod"

export const submitDeliverablesSchema = z.object({
  liveLink: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "Live project link is required" }),
  githubLink: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "GitHub link is required" }),
  linkedInPosts: z.array(z.string()),
}).refine(
  (data) => {
    // Validate LinkedIn posts are URLs if provided
    return data.linkedInPosts.every((post) => {
      if (post.trim() === "") return true // Allow empty strings
      try {
        new URL(post)
        return true
      } catch {
        return false
      }
    })
  },
  {
    message: "All LinkedIn post links must be valid URLs",
    path: ["linkedInPosts"],
  }
)

export type SubmitDeliverablesSchema = z.infer<typeof submitDeliverablesSchema>

