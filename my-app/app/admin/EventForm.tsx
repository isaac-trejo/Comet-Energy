"use client";

import { useActionState, useRef, useEffect } from "react";

import { createEvent, updateEvent, type CreateEventState, type UpdateEventState } from "./actions";
import type { CalendarEvent } from "./AdminCalendar";

type EventFormProps = {
  initialEvent?: CalendarEvent | null;
  onSuccess?: () => void;
};

export function EventForm({ initialEvent, onSuccess }: EventFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!initialEvent;
  const action = isEditing ? updateEvent : createEvent;
  const initialState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success && !isEditing) {
      formRef.current?.reset();
    }
    if (state.success && isEditing && onSuccess) {
      onSuccess();
    }
  }, [state.success, isEditing, onSuccess]);

  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "text-sm font-medium text-gray-700";

  return (
    <div className="max-w-2xl mx-auto">
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-4 bg-white rounded-lg shadow border border-gray-100 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {isEditing ? "Edit event" : "Add event"}
        </h2>

        {isEditing && (
          <input type="hidden" name="eventId" value={initialEvent?.id} />
        )}

        <div className="flex flex-col">
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={isPending}
            defaultValue={initialEvent?.title ?? ""}
            className={inputClasses}
          />
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
              defaultValue={initialEvent ? formatDateTimeLocal(initialEvent.start) : ""}
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
              defaultValue={initialEvent ? formatDateTimeLocal(initialEvent.end) : ""}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="location" className={labelClasses}>
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            disabled={isPending}
            defaultValue={initialEvent?.extendedProps?.location ?? ""}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className={labelClasses}>
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            disabled={isPending}
            defaultValue={initialEvent?.extendedProps?.description ?? ""}
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : isEditing ? "Update event" : "Add event"}
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
