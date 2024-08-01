import fixedNumber from './fixedNumber'

function timestampToUserReadableTime(timestamp) {
  const milliseconds = timestamp.toMillis()
  const date = new Date(milliseconds)

  const hours = fixedNumber(date.getHours())
  const minutes = fixedNumber(date.getMinutes())
  const day = fixedNumber(date.getDate())
  const month = fixedNumber(date.getMonth() + 1)
  const year = date.getFullYear()

  // Format the date as desired: HH:SS, DD-MM-YYYY
  const formattedDate = `${hours}:${minutes}, ${day}-${month}-${year}`

  return formattedDate
}

export default timestampToUserReadableTime
