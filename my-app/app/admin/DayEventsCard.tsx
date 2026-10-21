"use client";

import { useState } from "react";
import type { CalendarEvent } from "./AdminCalendar";
import { deleteEvent } from "./actions";

function formatHeading(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeRange(event: CalendarEvent) {
  const start = new Date(event.start).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const end = new Date(event.end).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${start} - ${end}`;
}

type DayEventsCardProps = {
  date: string;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
};

export function DayEventsCard({ date, events, onEditEvent }: DayEventsCardProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (eventId: string) => {
    setIsDeleting(true);
    const result = await deleteEvent(eventId);
    setIsDeleting(false);
    if (result.success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{formatHeading(date)}</h2>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">No events scheduled.</p>
      ) : (
        <ul className="flex flex-col gap-3 mt-4">
          {events.map((event) => (
            <li key={event.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{formatTimeRange(event)} • {event.extendedProps?.location}</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-open:rotate-90">▶</span>
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  {event.extendedProps?.description || "No description provided."}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onEditEvent?.(event)}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(event.id)}
                    className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>

                {deleteConfirmId === event.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={isDeleting}
                          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={isDeleting}
                          className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
