import { useState, useEffect } from 'react'

let exBegain = new Date('Nov 16, 2021').getTime()

export function useDateExperience() {
  const [time, setTime] = useState()
  useEffect(() => {
    // Get time now
    let dateNow = new Date().getTime()

    // Difference between begain and now
    let actualDate = dateNow - exBegain
    let years = actualDate / 1000 / 60 / 60 / 24 / 365.242199
    let months = actualDate / 1000 / 60 / 60 / 24 / 30
    if (years < 1 && Math.round(months) !== 12) {
      setTime(`${Math.round(months)} monthes`)
    } else if (years > 1 || Math.round(months) === 12) {
      setTime(`${Math.round(years)}+ years`)
    }
  }, [])
  return {
    time,
  }
}
