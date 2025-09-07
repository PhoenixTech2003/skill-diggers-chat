"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRoomFormType } from "~/types/rooms";
import { createRoomFormSchema } from "~/validation/rooms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "sonner";
import { createRoomAction } from "~/server/actions";
import { useRouter } from "next/navigation";

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<CreateRoomFormType>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: CreateRoomFormType) => {
    toast.promise(createRoomAction(values), {
      loading: "Creating room...",
      success: () => {
        setOpen(false);
        router.refresh();
        form.reset();
        return `Room ${values.name} created successfully`;
      },
      error: "Failed to create room",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TypeScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
