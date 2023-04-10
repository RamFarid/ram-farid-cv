import { useState, useEffect } from 'react'

let exBegain = new Date('Nov 16, 2021')
export function useDateExperience() {
  const [time, setTime] = useState('')
  function calculateTimeDifference(date) {
    const now = new Date()
    const yearsDiff = now.getFullYear() - date.getFullYear()
    const monthsDiff = now.getMonth() - date.getMonth()
    const totalMonths = yearsDiff * 12 + monthsDiff

    const years = totalMonths / 12

    setTime(`+${years.toFixed(1)} years`)
  }

  useEffect(() => {
    calculateTimeDifference(exBegain)
  }, [])
  return time
}
