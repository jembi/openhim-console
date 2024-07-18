import {
  sub,
  differenceInMinutes,
  differenceInHours,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInDays
} from 'date-fns'
import {TimeSeriesScale} from '../types'

export function getTimeDiffScale(
  from: Date,
  until: Date
): {diff: number; scale: TimeSeriesScale} {
  const diffInYears = differenceInYears(until, from)
  const diffInMonths = differenceInMonths(until, from)
  const diffInWeeks = differenceInWeeks(until, from)
  const diffInDays = differenceInDays(until, from)
  const diffInHours = differenceInHours(until, from)
  const diffInMinutes = differenceInMinutes(until, from)

  if (diffInYears > 1) {
    return {diff: diffInYears, scale: TimeSeriesScale.year}
  } else if (diffInMonths > 1 || diffInYears == 1) {
    return {diff: diffInMonths, scale: TimeSeriesScale.month}
  } else if (diffInWeeks > 1 || diffInMonths == 1) {
    return {diff: diffInWeeks, scale: TimeSeriesScale.week}
  } else if (diffInDays > 1 || diffInWeeks == 1) {
    return {diff: diffInDays, scale: TimeSeriesScale.day}
  } else if (diffInHours > 1 || diffInDays == 1) {
    return {diff: diffInHours, scale: TimeSeriesScale.hour}
  } else {
    return {diff: diffInMinutes, scale: TimeSeriesScale.minute}
  }
}
