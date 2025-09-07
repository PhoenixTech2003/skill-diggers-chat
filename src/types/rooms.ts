import type { z } from "zod";
import type { createRoomFormSchema } from "~/validation/rooms";

export type CreateRoomFormType = z.infer<typeof createRoomFormSchema>;
export type CreateRoomParamType = CreateRoomFormType & {
  userId: string;
};
