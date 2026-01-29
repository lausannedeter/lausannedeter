export const generateMonthsRange = (startDate, endDate) => {
  const months = []
  const current = new Date(startDate)

  current.setDate(1) // sécurité

  while (current <= endDate) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }

  return months
}