import fixedNumber from './fixedNumber'

function timestampToUserReadableTime(timestamp, time = true) {
  if (!timestamp) return null
  const milliseconds =
    typeof timestamp === 'number' ? timestamp : timestamp.toMillis()
  const date = new Date(milliseconds)

  const hours = fixedNumber(date.getHours())
  const minutes = fixedNumber(date.getMinutes())
  const day = fixedNumber(date.getDate())
  const month = fixedNumber(date.getMonth() + 1)
  const year = date.getFullYear()

  const formattedDate = `${hours}:${minutes}, ${year}-${month}-${day}`
  const formattedDateWithoutTime = `${year}-${month}-${day}`

  return time ? formattedDate : formattedDateWithoutTime
}

export default timestampToUserReadableTime
