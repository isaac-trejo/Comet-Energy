import type { CalendarEvent } from "./AdminCalendar";

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

export function DayEventsCard({ date, events }: { date: string; events: CalendarEvent[] }) {
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
                    <p className="text-sm text-gray-600">{formatTimeRange(event)}</p>
                  </div>
                  <span className="text-gray-400 transition-transform group-open:rotate-90">▶</span>
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  {event.extendedProps?.description || "No description provided."}
                </p>
              </details>
              {event.extendedProps?.location && (
                <p className="text-sm text-gray-500 mt-1">{event.extendedProps.location}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
