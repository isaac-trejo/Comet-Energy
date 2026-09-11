"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CreateEventState = {
  success: boolean;
  message: string;
};

export async function createEvent(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "You must be signed in to add an event." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsAt = String(formData.get("endsAt") ?? "");

  if (!title || !description || !startsAt || !endsAt) {
    return { success: false, message: "Title, description, start, and end are required." };
  }

  const startsAtDate = new Date(startsAt);
  const endsAtDate = new Date(endsAt);

  if (Number.isNaN(startsAtDate.getTime()) || Number.isNaN(endsAtDate.getTime())) {
    return { success: false, message: "Start and end must be valid dates." };
  }

  if (endsAtDate < startsAtDate) {
    return { success: false, message: "End time must be after the start time." };
  }

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        location: location || null,
        startsAt: startsAtDate,
        endsAt: endsAtDate,
      },
    });
  } catch {
    return { success: false, message: "Something went wrong while saving the event." };
  }

  return { success: true, message: "Event added successfully." };
}
