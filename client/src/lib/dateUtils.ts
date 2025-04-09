import { 
  format, 
  formatDistance, 
  formatRelative, 
  subDays, 
  addDays, 
  isToday, 
  isYesterday, 
  isTomorrow,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';

/**
 * Formats a date as a readable string based on how recent it is
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  } else if (isWithinInterval(dateObj, {
    start: subDays(new Date(), 7),
    end: new Date()
  })) {
    return format(dateObj, 'EEEE') + ` at ${format(dateObj, 'h:mm a')}`;
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
}

/**
 * Returns a user-friendly relative time string (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Generates an array of dates for a calendar display
 * @param month Month to display (0-11)
 * @param year Year to display
 * @returns Array of date objects
 */
export function getCalendarDays(month: number, year: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the first day of the week that contains the first day of the month
  const startDate = startOfWeek(firstDay);
  
  // Get the last day of the week that contains the last day of the month
  const endDate = endOfWeek(lastDay);
  
  return eachDayOfInterval({ start: startDate, end: endDate });
}

/**
 * Determines if a date falls within the current week
 * @param date Date to check
 * @returns Boolean indicating if date is in current week
 */
export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return isWithinInterval(dateObj, {
    start: startOfWeek(now),
    end: endOfWeek(now)
  });
}

/**
 * Determines if a date falls within the current month
 * @param date Date to check
 * @returns Boolean indicating if date is in current month
 */
export function isThisMonth(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return isWithinInterval(dateObj, {
    start: startOfMonth(now),
    end: endOfMonth(now)
  });
}

/**
 * Determines if a date falls within the current year
 * @param date Date to check
 * @returns Boolean indicating if date is in current year
 */
export function isThisYear(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return isWithinInterval(dateObj, {
    start: startOfYear(now),
    end: endOfYear(now)
  });
}

/**
 * Formats a time range for appointment display
 * @param startTime Start time string (e.g., "09:00 AM")
 * @param duration Duration in minutes
 * @returns Formatted time range string
 */
export function formatTimeRange(startTime: string, duration: number = 60): string {
  const [time, period] = startTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let startDate = new Date();
  startDate.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours);
  startDate.setMinutes(minutes);
  
  const endDate = new Date(startDate.getTime() + duration * 60000);
  
  return `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
}

/**
 * Get formatted date for header displays
 * @returns Current date formatted as "Friday, 30 Jan"
 */
export function getFormattedHeaderDate(): string {
  return format(new Date(), 'EEEE, d MMM');
}
