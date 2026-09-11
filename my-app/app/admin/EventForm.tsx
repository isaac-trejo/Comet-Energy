"use client";

import { useActionState } from "react";

import { createEvent, type CreateEventState } from "./actions";

const initialState: CreateEventState = { success: false, message: "" };

export function EventForm() {
  const [state, formAction, isPending] = useActionState(createEvent, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required disabled={isPending} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required disabled={isPending} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location">Location (optional)</label>
        <input id="location" name="location" type="text" disabled={isPending} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="startsAt">Starts at</label>
        <input id="startsAt" name="startsAt" type="datetime-local" required disabled={isPending} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="endsAt">Ends at</label>
        <input id="endsAt" name="endsAt" type="datetime-local" required disabled={isPending} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Add event"}
      </button>

      {state.message && (
        <p role="status">{state.success ? `✅ ${state.message}` : `⚠️ ${state.message}`}</p>
      )}
    </form>
  );
}
