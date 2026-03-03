export const useUpcomingEvents = (events, categoryMap, limit = 10) => {
  const now = new Date()
  try {
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
  } catch(e) {
    console.error('useUpcomingEvents crash:', e.message, '\nevent sample:', JSON.stringify(events[0]))
    return []
  }
}