<script setup>
/* ------------------------------ Gestion evenements ------------------------------------------- */
const { categories, events, categoryMap, affiches } = useEvents()

const EVENTS_LIMIT = 50
const upcomingEvents = useUpcomingEvents(events, categoryMap, EVENTS_LIMIT)
    .map(normalizeEventDates)

const firstDate = upcomingEvents[0].occurrenceDate
const lastDate = upcomingEvents[upcomingEvents.length - 1].occurrenceDate

const months = generateMonthsRange(firstDate, lastDate)
const affichesByMonth = groupAffichesByMonth(affiches)

/* --------------------------------- Gestion filtres --------------------------------- */
const activeFilters = ref([])

function toggleFilters(category) {
    if (activeFilters.value.includes(category)) {
        activeFilters.value = activeFilters.value.filter(c => c !== category)
    } else {
        activeFilters.value.push(category)
    }
}

function deselectAllFilters() {
    activeFilters.value = []
}

const filteredEvents = computed(() => {
    if (activeFilters.value.length === 0) {
        return upcomingEvents
    }

    return upcomingEvents.filter(event =>
        !activeFilters.value.includes(event.categoryData.id)
    )
})


const eventsByMonth = computed(() =>
    groupEventsByMonth(filteredEvents.value)
)
</script>

<template>
    <section class="calendar-page">
        <CalendarFiltersContainer :categories="categories" :activeFilters="activeFilters"
            @toggle-filters="toggleFilters" @deselect-all-filters="deselectAllFilters"></CalendarFiltersContainer>

        <CalendarMonthContainer v-for="month in months" :key="month.toISOString()"
            :month-events="eventsByMonth[`${month.getFullYear()}-${month.getMonth()}`] || []" :month-name="month"
            :affiche="affichesByMonth[`${month.getFullYear()}-${month.getMonth()}`] || null">
        </CalendarMonthContainer>
    </section>
</template>

<style scoped>
.calendar-page {
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    gap: 50px;
}
</style>