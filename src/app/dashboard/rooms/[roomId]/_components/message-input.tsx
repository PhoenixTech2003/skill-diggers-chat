"use client";

import type React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import type { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

const formSchema = z.object({
  content: z.string().min(1),
});
interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const sendMessage = useMutation(api.messages.sendMessage);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sendMessage({
        roomId: roomId as Id<"room">,
        content: values.content,
      });
      form.reset();
    } catch {
      toast.error("Failed to send message please contact support");
    }
  };

  return (
    <div className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/80 fixed inset-x-0 bottom-4 z-20 mx-auto w-[min(100%-1rem,420px)] rounded-xl border p-4 shadow-lg backdrop-blur sm:w-[480px] md:w-[560px] lg:w-[640px] xl:w-[720px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} placeholder="Let's get chatting" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="h-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
