import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EventForm } from "./EventForm";
import { AdminCalendarSection } from "./AdminCalendarSection";
import type { CalendarEvent } from "./AdminCalendar";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const events = await prisma.event.findMany({ orderBy: { startsAt: "asc" } });
  const calendarEvents: CalendarEvent[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startsAt.toISOString(),
    end: event.endsAt.toISOString(),
    extendedProps: {
      description: event.description,
      location: event.location,
    },
  }));

  return (
    <main className="p-6">
      <h1>Admin dashboard</h1>
      <p>Signed in as {session.user.email}.</p>

      <div className="mt-6">
        <AdminCalendarSection events={calendarEvents} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add event</h2>
        <EventForm />
      </div>
    </main>
  );
}
