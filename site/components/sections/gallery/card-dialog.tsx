"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";

export function CardAndDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShowcasePanel label="Card">
        <Card>
          <CardHeader>
            <CardTitle>Academy</CardTitle>
            <CardDescription>Cohort-based courses, built on the same auth and theming as every project.</CardDescription>
          </CardHeader>
          <CardContent>
            <p style={{ font: "var(--mo-text-body)", margin: 0, color: "var(--muted)" }}>
              12 modules · magic-link sign-in · ZeptoMail delivery
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="sm">
              Open dashboard
            </Button>
            <Button variant="ghost" size="sm">
              View repo →
            </Button>
          </CardFooter>
        </Card>
      </ShowcasePanel>

      <ShowcasePanel label="Dialog">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Delete branch…
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>Delete feat/legacy-auth?</DialogTitle>
            <DialogDescription>
              This branch was merged into development 3 days ago. Deleting it can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete branch
            </Button>
          </DialogFooter>
          <DialogClose onOpenChange={setOpen} />
        </Dialog>
      </ShowcasePanel>
    </>
  );
}
