<script setup>
const props = defineProps({
    monthEvents: {
        type: Array
    },
    monthName: {
        type: Date
    },
    affiche: {
        type: Object
    }
})

</script>

<template>
    <div class="calendar-month-container">
        <div class="title-container">
            <h2 class="month-title">{{ monthName.toLocaleDateString('fr-CH', {
                month: 'long',
                year: 'numeric'
            }) }}</h2>
        </div>

        <div v-if="affiche && affiche.link !== ''" class="download-link-container">
            <span class="link-text">
                Télécharge <a class="link" :href="`/affiches/${affiche.link}`" download>l'agenda version pdf</a> et imprime le pour ton lieu co'
            </span>
        </div>

        <transition-group name="eventsList" tag="div">
            <transition-group name="eventsList" tag="div" v-if="monthEvents.length" class="month-content-container">
                <EventBlock v-for="event in monthEvents" :key="event.id" :event="event"></EventBlock>
            </transition-group>
            <p v-else class="empty">
                Pas d’évènement pour le moment
            </p>
        </transition-group>

    </div>
</template>

<style scoped>
.calendar-month-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.title-container {
    background-color: #1A160F;
    display: flex;
    justify-content: end;
    width: 50%;
    max-width: 400px;
    padding: 10px 20px;
}

.month-title {
    color: white;
    font-size: 30px;
    text-transform: capitalize;
}

.download-link-container {
    background-color: #CD523C;
    color: white;
    display: flex;
    padding: 10px;
    justify-content: center;
}

.link-text {
    text-align: center;
    font-size: 14px;
}

.link {
    font-family: "Azeret Medium";
    text-decoration: underline;
    color: white;
}

.month-content-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 24px;
}

.empty {
    text-align: center;
    font-size: 14px;
}

/* --------------------- Animation pour events --------------------- */
.eventsList-enter-active,
.eventsList-leave-active {
    transition: all 0.5s ease;
}

.eventsList-enter-from,
.eventsList-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* TABLETTE */
@media (min-width: 750px) {

    .month-content-container {
        padding: 0 72px;
    }
}

/* DESKTOP */
@media (min-width: 1200px) {

    .month-content-container {
        padding: 0 144px;
    }
}
</style>