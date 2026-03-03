<script setup>
if (import.meta.prerender) {
  process.on('uncaughtException', (err) => {
    console.error('CALENDRIER CRASH:', err)
  })
}
const api = useApi()
const { data: _events } = await useAsyncData('events', () => api.get('/api/events'))
const { data: _categories } = await useAsyncData('categories', () => api.get('/api/categories'))
const { data: _affiches } = await useAsyncData('affiches', () => api.get('/api/affiches'))

// Refetch côté client uniquement
const { data: _eventsClient } = await useAsyncData('events-client', () => api.get('/api/events'), { server: false, lazy: true })
const { data: _categoriesClient } = await useAsyncData('categories-client', () => api.get('/api/categories'), { server: false, lazy: true })
const { data: _afficheClient } = await useAsyncData('affiches-client', () => api.get('/api/affiches'), { server: false, lazy: true })

const events = computed(() => _eventsClient.value?.data ?? _events.value?.data ?? [])
const categories = computed(() => _categoriesClient.value?.data ?? _categories.value?.data ?? [])
const affiches = computed(() => _afficheClient.value?.data ?? _affiches.value?.data ?? [])

const EVENTS_LIMIT = 50
const categoryMap = computed(() => createCategoryMap(categories.value))
const upcomingEvents = computed(() =>
  useUpcomingEvents(events.value, categoryMap.value, EVENTS_LIMIT)
)

const firstDate = computed(() => upcomingEvents.value[0]?.occurrenceDate)
const lastDate = computed(() => upcomingEvents.value[upcomingEvents.value.length - 1]?.occurrenceDate)
const months = computed(() =>
  firstDate.value && lastDate.value ? generateMonthsRange(firstDate.value, lastDate.value) : []
)

const affichesByMonth = computed(() => groupAffichesByMonth(affiches.value))
const activeFilters = ref([])

function toggleFilters(category) {
  if (activeFilters.value.includes(category)) {
    activeFilters.value = activeFilters.value.filter(c => c !== category)
  } else {
    activeFilters.value.push(category)
  }
}

function toggleAllFilters() {
  if (activeFilters.value.length === 0) {
    categories.value.forEach(cat => activeFilters.value.push(cat.id))
  } else {
    activeFilters.value = []
  }
}

const filteredEvents = computed(() => {
  if (activeFilters.value.length === 0) return upcomingEvents.value
  // Guard: skip events where categoryData is missing
  return upcomingEvents.value.filter(event => !activeFilters.value.includes(event.categoryData?.id))
})

const eventsByMonth = computed(() => groupEventsByMonth(filteredEvents.value))
</script>

<template>
  <section class="calendar-page">
    <CalendarFiltersContainer
      :categories="categories"
      :activeFilters="activeFilters"
      @toggle-filters="toggleFilters"
      @toggle-all-filters="toggleAllFilters"
    />
    <CalendarMonthContainer
      v-for="month in months"
      :key="month.toISOString()"
      :month-events="eventsByMonth[`${month.getFullYear()}-${month.getMonth()}`] || []"
      :month-name="month"
      :affiche="affichesByMonth[`${month.getFullYear()}-${month.getMonth()}`] || null"
    />
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