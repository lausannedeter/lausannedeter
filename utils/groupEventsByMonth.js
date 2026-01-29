export const groupEventsByMonth = (events) => {
    return events.reduce((acc, event) => {
        const d = event.occurrenceDate
        const key = `${d.getFullYear()}-${d.getMonth()}`

        if (!acc[key]) acc[key] = []
        acc[key].push(event)

        return acc
    }, {})
}
