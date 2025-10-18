"use client";

import type React from "react";

import { useState } from "react";
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
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function CreateIssueDialog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: "",
    difficulty: "medium",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle issue creation here
    console.log("Creating issue:", formData);
    setFormData({
      title: "",
      description: "",
      points: "",
      difficulty: "medium",
      tags: "",
    });
    // Reset form after successful submission
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Issue Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Implement dark mode toggle"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points" className="text-foreground">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                placeholder="e.g., 100"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: e.target.value })
                }
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-foreground">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="bg-secondary border-border text-foreground w-full rounded-md border px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              placeholder="e.g., frontend, react, ui"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Issue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
