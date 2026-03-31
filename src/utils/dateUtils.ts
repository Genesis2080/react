import { differenceInDays } from 'date-fns';

export function calculateDaysDifference(startDate: Date, endDate: Date): number {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new TypeError('Both arguments must be Date objects');
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new TypeError('Invalid Date objects provided');
  }

  return differenceInDays(endDate, startDate);
}