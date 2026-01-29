export const formatOccurrenceDateTime = (event) => {
    const dateOpts = { day: 'numeric', month: 'long' }
    const timeOpts = { hour: '2-digit', minute: '2-digit' }

    const sameDay =
        event.dayStart.toDateString() === event.dayEnd.toDateString()

    if (sameDay) {
        return `${event.dayStart.toLocaleDateString('fr-CH', dateOpts)} · ${event.dayStart.toLocaleTimeString('fr-CH', timeOpts)} – ${event.dayEnd.toLocaleTimeString('fr-CH', timeOpts)}`
    }

    return event.dayStart.toLocaleDateString('fr-CH', dateOpts)
}
