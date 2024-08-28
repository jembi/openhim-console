const convertTimestampFormat = (isoStringDate: Date) => {
  const date = new Date(isoStringDate)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
  const formattedDate = date.toLocaleString('en-CA', options)
  const [datePart, timePart] = formattedDate.split(/, | /)

  if (isoStringDate instanceof Date === false) isoStringDate = new Date()
  const off = isoStringDate.getTimezoneOffset() * -1
  isoStringDate = new Date(isoStringDate.getTime() + off * 60000)

  return (
    `${datePart.replace(/\//g, '-')} ${timePart}` +
    (off < 0 ? '-' : ' +') +
    ('0' + Math.abs(Math.floor(off / 60))).substr(-2) +
    ('0' + Math.abs(off % 60)).substr(-2)
  )
}

export default convertTimestampFormat
