"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "../../../../../convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  body: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
});

type CreateIssueForm = z.infer<typeof createIssueSchema>;

export function CreateIssueDialog() {
  const form = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const createIssue = useMutation(api.issues.createIssue);
  const onSubmit = async (data: CreateIssueForm) => {
    toast.promise(createIssue(data), {
      loading: "Creating issue...",
      success: () => {
        form.reset();
        return "Issue created! Awaiting admin approval.";
      },
      error: "Failed to create issue. Please try again.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Create Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border max-w-2xl border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Create New Issue
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new bounty issue for the community to tackle
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Issue Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Implement dark mode toggle"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Create Issue"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
