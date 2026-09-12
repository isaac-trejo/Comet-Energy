"use client";

import { useActionState } from "react";

import { createEvent, type CreateEventState } from "./actions";

const initialState: CreateEventState = { success: false, message: "" };

export function EventForm() {
  const [state, formAction, isPending] = useActionState(createEvent, initialState);

  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "text-sm font-medium text-gray-700";

  return (
    <div className="max-w-2xl mx-auto">
      <form
        action={formAction}
        className="flex flex-col gap-4 bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <div className="flex flex-col">
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input id="title" name="title" type="text" required disabled={isPending} className={inputClasses} />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label htmlFor="startsAt" className={labelClasses}>
              Starts at
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              disabled={isPending}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="endsAt" className={labelClasses}>
              Ends at
            </label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              required
              disabled={isPending}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className={labelClasses}>
            Description
          </label>
          <textarea id="description" name="description" required disabled={isPending} className={inputClasses} />
        </div>

        <div className="flex flex-col">
          <label htmlFor="location" className={labelClasses}>
            Location (optional)
          </label>
          <input id="location" name="location" type="text" disabled={isPending} className={inputClasses} />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Add event"}
        </button>

        {state.message && (
          <p role="status" className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
            {state.success ? `✅ ${state.message}` : `⚠️ ${state.message}`}
          </p>
        )}
      </form>
    </div>
  );
}
