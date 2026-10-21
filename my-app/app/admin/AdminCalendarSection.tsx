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

type AdminCalendarSectionProps = {
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
};

export function AdminCalendarSection({ events, onEditEvent }: AdminCalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateString(new Date()));

  const dayEvents = events.filter(
    (event) => toLocalDateString(new Date(event.start)) === selectedDate
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <DayEventsCard date={selectedDate} events={dayEvents} onEditEvent={onEditEvent} />
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <AdminCalendar events={events} onDateClick={setSelectedDate} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
