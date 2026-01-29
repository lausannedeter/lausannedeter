import { normalizeEventDates } from '~/utils/normalizeEventDates'
import { splitEventByDay } from '~/utils/splitEventByDay'

export const useUpcomingEvents = (events, categoryMap, limit = 10) => {
  const now = new Date()

  return events
    .map(normalizeEventDates)
    .filter(event => event.end >= now)
    .flatMap(event => {
      const occurrences = splitEventByDay(event)
      return occurrences.map(occ => ({
        ...occ,
        categoryData: categoryMap[occ.category] || null
      }))
    })
    .sort((a, b) => a.dayStart - b.dayStart)
    .slice(0, limit)
}
