import { sub, differenceInMinutes, differenceInHours, differenceInWeeks, differenceInMonths, differenceInYears, differenceInDays } from 'date-fns';
import { TimeSeriesScale } from '../types';

export function getTimeDiffScale(from: Date, until: Date): {diff: number; scale: TimeSeriesScale} {
  let diff;

  if ((diff = differenceInYears(until, from)) > 1) {
    return { diff, scale: TimeSeriesScale.year };
  } else if ((diff = differenceInMonths(until, from)) > 1 || (diff = differenceInYears(until, from)) == 1) {
    return { diff, scale: TimeSeriesScale.month };
  } else if ((diff = differenceInWeeks(until, from)) > 1 || (diff = differenceInMonths(until, from)) == 1) {
    return { diff, scale: TimeSeriesScale.week };
  } else if ((diff = differenceInDays(until, from)) > 1 || (diff = differenceInWeeks(until, from) == 1)) {
    return { diff, scale: TimeSeriesScale.day };
  } else if ((diff = differenceInHours(until, from)) > 1 || (diff = differenceInDays(until, from) == 1)) {
    return { diff, scale: TimeSeriesScale.hour };
  } else {
    diff = differenceInMinutes(until, from);
    return { diff, scale: TimeSeriesScale.minute };
  }
}
