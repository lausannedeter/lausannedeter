export const normalizeEventDates = (event) => {
    const start = new Date(event.startDate)
    const end = event.endDate
        ? new Date(event.endDate)
        : start

    return {
        ...event,
        start,
        end,
        isMultiDay: start.toDateString() !== end.toDateString()
    }
}