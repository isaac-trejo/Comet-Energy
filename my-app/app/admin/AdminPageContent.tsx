"use client";

import { useRef, useState } from "react";

import { EventForm } from "./EventForm";
import { AdminCalendarSection } from "./AdminCalendarSection";
import type { CalendarEvent } from "./AdminCalendar";

type AdminPageContentProps = {
  initialEvents: CalendarEvent[];
  userEmail: string;
};

export function AdminPageContent({ initialEvents, userEmail }: AdminPageContentProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleFormSuccess = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <main className="p-6">
      <h1>Admin dashboard</h1>
      <p>Signed in as {userEmail}.</p>

      <div className="mt-6">
        <AdminCalendarSection events={initialEvents} onEditEvent={handleEditEvent} />
      </div>

      <div className="mt-6" ref={formRef}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedEvent ? "Edit event" : "Add event"}
        </h2>
        <EventForm initialEvent={selectedEvent} onSuccess={handleFormSuccess} />
      </div>
    </main>
  );
}
