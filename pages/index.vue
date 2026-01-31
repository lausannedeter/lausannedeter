<script setup>
const { categories, events, categoryMap, affiches } = useEvents()

const EVENTS_LIMIT = 3
const upcomingEvent = useUpcomingEvents(events, categoryMap, EVENTS_LIMIT)
    .map(normalizeEventDates)
</script>

<template>
    <section class="home-page">
        <div class="welcome-container">
            <div class="welcome-text-container">
                <div class="title-container welcome">
                    <div class="main-title-container welcome">
                        <h2 class="title">Bienvenue</h2>
                    </div>
                    <div class="title-container-subblock welcome"></div>
                </div>

                <p class="welcome-description">
                    Ici, nous visibilisons toutes les luttes qui se placent à gauche du curseur politique
                    et qui
                    se battent
                    contre le capitalisme et ses oppressions.
                    <br>
                    <br>
                    Découvrez où et quand les luttes romandes s’organisent!
                </p>
            </div>
            <div class="event-section">
                <h3 class="subtitle">Prochains évènements:</h3>
                <transition-group name="eventsList" tag="div" v-if="upcomingEvent.length"
                    class="month-content-container">
                    <EventBlock v-for="event in upcomingEvent" :key="event.id" :event="event"></EventBlock>
                </transition-group>
            </div>
            <div class="buttons-container">
                <nuxt-link class="button see-calendar" to="/calendrier">Voir le calendrier</nuxt-link>
                <a class="button share-event" href="mailto:lausannedeter@proton.me">Partager un évènement</a>
            </div>
        </div>

        <div class="copaines-container">
            <div class="copaines-text-container">
                <div class="title-container copaines">
                    <div class="main-title-container copaines">
                        <h2 class="title">Copaines</h2>
                    </div>
                    <div class="title-container-subblock copaines"></div>
                </div>

                <p class="copaines-description">
                    En romandie, beaucoup de lieux sont fertiles à la resistance. Certains peuvent être
                    des points de
                    repères pour militantexs perdues.
                    <br>
                    <br>
                    Plusieurs collectifs s’organisent autour de differentes causes. C’est notamment dans cet
                    agenda que
                    ces luttes convergent. Soyons solidaires, soutenons-les.
                </p>
            </div>
            <div class="buttons-container">
                <nuxt-link class="button see-collectifs" to="/copaines">Voir les copaines</nuxt-link>
            </div>
        </div>
    </section>
</template>

<style scoped>
.home-page {
    display: flex;
    flex-direction: column;
    gap: 50px;
    padding: 50px 0px;
}

.welcome-container,
.copaines-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.welcome-text-container,
.copaines-text-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.title-container.welcome {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: end;
    align-self: flex-end;
}

.title-container {
    width: 60%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
}

.main-title-container {
    width: 100%;
    padding: 10px 20px;
}

.main-title-container.welcome {
    background-color: #52BFEA;
}

.title-container-subblock.welcome {
    background-color: #90E0F3;
    display: flex;
    width: calc(100% - 20px);
    height: 20px;
}

.title {
    font-size: 30px;
}

.subtitle {
    font-size: 14px;
    font-family: "Azeret Medium";
    font-weight: normal;
}

.welcome-description,
.copaines-description {
    font-size: 14px;
    padding: 0 24px;
}

.event-section {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.month-content-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 24px;
}

.see-calendar,
.see-collectifs {
    align-self: end;
}

.main-title-container.copaines {
    background-color: #A8BA9A;
    text-align: end;
}

.title-container-subblock.copaines {
    background-color: #ACE894;
    display: flex;
    width: calc(100% - 20px);
    height: 20px;
}

/* TABLETTE */
@media (min-width: 750px) {

    .welcome-description,
    .copaines-description {
        padding: 0 72px;
    }

    .event-section {
        padding: 0 72px;
    }

    .buttons-container {
        padding: 0 72px;
    }
}

/* DESKTOP */
@media (min-width: 1200px) {

    .welcome-description,
    .copaines-description {
        padding: 0 144px;
    }

    .event-section {
        padding: 0 144px;
    }

    .buttons-container {
        padding: 0 144px;
    }
}
</style>