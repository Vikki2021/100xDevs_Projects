import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

async function getOAuthClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  if (!account?.access_token) throw new Error("No Google account linked");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });
  return oauth2Client;
}

export async function createCalendarEvent(
  userId: string,
  title: string,
  dueDate: Date,
  description?: string
) {
  const auth = await getOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description: description || "",
      start: { dateTime: dueDate.toISOString(), timeZone: "UTC" },
      end: {
        dateTime: new Date(dueDate.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "UTC",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
          { method: "email", minutes: 60 },
        ],
      },
    },
  });
  return event.data.id;
}

export async function deleteCalendarEvent(userId: string, eventId: string) {
  const auth = await getOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });
  await calendar.events.delete({ calendarId: "primary", eventId });
}

export async function listCalendarEvents(
  userId: string,
  timeMin: Date,
  timeMax: Date
) {
  const auth = await getOAuthClient(userId);
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 100,
  });
  return res.data.items || [];
}
