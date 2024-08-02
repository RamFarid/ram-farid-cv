import fixedNumber from './fixedNumber'

function timestampToUserReadableTime(timestamp, time = true) {
  const milliseconds = timestamp.toMillis()
  const date = new Date(milliseconds)

  const hours = fixedNumber(date.getHours())
  const minutes = fixedNumber(date.getMinutes())
  const day = fixedNumber(date.getDate())
  const month = fixedNumber(date.getMonth() + 1)
  const year = date.getFullYear()

  const formattedDate = `${hours}:${minutes}, ${day}-${month}-${year}`
  const formattedDateWithoutTime = `${day}-${month}-${year}`

  return time ? formattedDate : formattedDateWithoutTime
}

export default timestampToUserReadableTime
