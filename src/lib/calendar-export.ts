import { format, addHours } from 'date-fns';

export function formatICSDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

export function generateICS(event: {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date | null;
  venueName: string;
  venueAddress: string;
  imageUrl?: string | null;
  url?: string;
}): string {
  const now = formatICSDate(new Date());
  const dtStart = formatICSDate(new Date(event.dateStart));
  const dtEnd = event.dateEnd ? formatICSDate(new Date(event.dateEnd)) : formatICSDate(addHours(new Date(event.dateStart), 2));
  
  const description = event.description.replace(/<[^>]*>/g, '').substring(0, 200);
  
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AroundMe//Event Calendar//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@aroundme.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(`${event.venueName}, ${event.venueAddress}`)}`,
    `URL:${event.url || `https://aroundme.app/event/${event.id}`}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

export function downloadICS(event: {
  id: string;
  title: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date | null;
  venueName: string;
  venueAddress: string;
  imageUrl?: string | null;
  url?: string;
}): void {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateGoogleCalendarUrl(event: {
  title: string;
  dateStart: Date;
  dateEnd?: Date | null;
  venueName: string;
  venueAddress: string;
  description: string;
  url?: string;
}): string {
  const startDate = format(new Date(event.dateStart), "yyyyMMdd'T'HHmmss'Z'");
  const endDate = event.dateEnd 
    ? format(new Date(event.dateEnd), "yyyyMMdd'T'HHmmss'Z'")
    : format(addHours(new Date(event.dateStart), 2), "yyyyMMdd'T'HHmmss'Z'");
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description.substring(0, 300),
    location: `${event.venueName}, ${event.venueAddress}`,
    sf: 'true',
    output: 'xml',
  });

  if (event.url) {
    params.set('url', event.url);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookUrl(event: {
  title: string;
  dateStart: Date;
  dateEnd?: Date | null;
  venueName: string;
  venueAddress: string;
  description: string;
}): string {
  const startDate = format(new Date(event.dateStart), "yyyy-MM-dd'T'HH:mm:ss");
  const endDate = event.dateEnd 
    ? format(new Date(event.dateEnd), "yyyy-MM-dd'T'HH:mm:ss")
    : format(addHours(new Date(event.dateStart), 2), "yyyy-MM-dd'T'HH:mm:ss");

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    location: `${event.venueName}, ${event.venueAddress}`,
    body: event.description.substring(0, 500),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateYahooUrl(event: {
  title: string;
  dateStart: Date;
  dateEnd?: Date | null;
  venueName: string;
  description: string;
}): string {
  const startDate = format(new Date(event.dateStart), 'yyyyMMDdTHHmmss');
  const endDate = event.dateEnd 
    ? format(new Date(event.dateEnd), 'yyyyMMDdTHHmmss')
    : format(addHours(new Date(event.dateStart), 2), 'yyyyMMDdTHHmmss');

  const params = new URLSearchParams({
    title: event.title,
    st: startDate,
    et: endDate,
    desc: event.description.substring(0, 200),
    loc: event.venueName,
  });

  return `https://calendar.yahoo.com/?v=60&${params.toString()}`;
}
