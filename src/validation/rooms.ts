import { z } from "zod";

export const createRoomFormSchema = z.object({
  name: z.string().min(1),
});
