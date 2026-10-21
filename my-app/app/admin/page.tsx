import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminPageContent } from "./AdminPageContent";
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
    <AdminPageContent initialEvents={calendarEvents} userEmail={session.user.email} />
  );
}
