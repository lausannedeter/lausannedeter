<script setup>
const props = defineProps({
    event: {
        type: Object
    }
})
</script>

<template>
    <div class="event-block-container">
        <div class="date-container">
            <span class="date-day">{{ event.occurrenceDate.toLocaleDateString('fr-CH', { weekday: 'short' }) }}</span>
            <span class="date-num">{{ event.occurrenceDate.toLocaleDateString('fr-CH', { day: 'numeric' }) }}</span>
        </div>

        <nuxt-link :to="`/calendrier/${event.slug}`" class="event-link">
            <div class="info-container"
                :style="{ borderBottom: `3px solid ${event.categoryData.color}`, borderRight: `10px solid ${event.categoryData.color}` }"
                @click="console.log(event.slug)">
                <h3 class="event-title">{{ event.title }}</h3>
                <div class="event-more-info">
                    <span>{{ event.organizer }} - {{ event.dayStart.toLocaleTimeString('fr-CH', {
                        hour: '2-digit',
                        minute: '2-digit' }) }} - {{ event.location }}</span>
                </div>
            </div>
        </nuxt-link>
    </div>
</template>

<style scoped>
.event-block-container {
    display: flex;
    gap: 15px;
    align-items: center;
    width: 100%;
}

.date-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Azeret Medium";
}

.date-day {
    font-size: 12px;
}

.date-num {
    font-size: 24px;
}

.event-link {
    width: 100%;
    display: flex;
}

.info-container {
    padding-right: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.event-title {
    font-size: 14px;
    text-transform: capitalize;
}

.event-more-info {
    font-size: 12px;
    text-transform: capitalize;
}
</style>