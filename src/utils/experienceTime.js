export default function experienceTime() {
  const exBegain = new Date('Nov 16, 2021')
  const now = new Date()
  const yearsDiff = now.getFullYear() - exBegain.getFullYear()
  const monthsDiff = now.getMonth() - exBegain.getMonth()
  const totalMonths = yearsDiff * 12 + monthsDiff

  const years = totalMonths / 12

  return `+${years.toFixed(1)} years`
}
