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
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
      <p className="text-gray-600 mb-6">Signed in as {userEmail}.</p>

      <div className="mt-8">
        <AdminCalendarSection events={initialEvents} onEditEvent={handleEditEvent} />
      </div>

      <div className="mt-8" ref={formRef}>
        <EventForm initialEvent={selectedEvent} onSuccess={handleFormSuccess} />
      </div>
    </>
  );
}
