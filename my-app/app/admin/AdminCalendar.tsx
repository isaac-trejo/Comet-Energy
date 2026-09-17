"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps?: {
    description?: string | null;
    location: string;
  };
};

export function AdminCalendar({
  events,
  onDateClick,
  selectedDate,
}: {
  events: CalendarEvent[];
  onDateClick: (dateStr: string) => void;
  selectedDate?: string;
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      height="auto"
      eventDisplay="block"
      eventContent={(arg) => arg.event.title}
      dateClick={(info) => onDateClick(info.dateStr)}
      dayCellClassNames={(arg) =>
        arg.date.toISOString().slice(0, 10) === selectedDate ? ["fc-day-selected"] : []
      }
    />
  );
}
