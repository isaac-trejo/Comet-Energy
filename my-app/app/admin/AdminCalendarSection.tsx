"use client";

import { useState } from "react";

import { AdminCalendar, type CalendarEvent } from "./AdminCalendar";
import { DayEventsCard } from "./DayEventsCard";

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AdminCalendarSection({ events }: { events: CalendarEvent[] }) {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateString(new Date()));

  const dayEvents = events.filter((event) => event.start.slice(0, 10) === selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <DayEventsCard date={selectedDate} events={dayEvents} />
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <AdminCalendar events={events} onDateClick={setSelectedDate} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
