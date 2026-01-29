export const splitEventByDay = (event) => {
    const days = []

    const start = new Date(event.start)
    const end = new Date(event.end)

    let current = new Date(start)
    current.setHours(0, 0, 0, 0)

    const lastDay = new Date(end)
    lastDay.setHours(0, 0, 0, 0)

    while (current <= lastDay) {
        const dayStart = new Date(current)
        const dayEnd = new Date(current)
        dayEnd.setHours(23, 59, 59, 999)

        // premier jour
        if (current.toDateString() === start.toDateString()) {
            dayStart.setTime(start.getTime())
        }

        // dernier jour
        if (current.toDateString() === end.toDateString()) {
            dayEnd.setTime(end.getTime())
        }

        days.push({
            ...event,
            occurrenceDate: new Date(current),
            dayStart,
            dayEnd,
            isOccurrence: true
        })

        current.setDate(current.getDate() + 1)
    }

    return days
}
