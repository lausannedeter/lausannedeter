<script setup>
  const api = useApi()
  const route = useRoute()
  const { resolve: resolveImage } = useEventImage()

  const { data: _events } = await useAsyncData('events', () => api.get('/api/events'))
  const { data: _eventsClient } = await useAsyncData('events-client', () => api.get('/api/events'), { server: false, lazy: true })
  const events = computed(() => _eventsClient.value?.data ?? _events.value?.data ?? [])
  const event = computed(() => events.value.find(e => e.slug === route.params.slug))

  const imageUrl = ref(null)
  watchEffect(async () => {
    if (event.value?.image) {
      imageUrl.value = await resolveImage(event.value.image)
    }
  })

  useSeoMeta({
    title: () => event.value?.title,
    description: () => event.value?.description,
    ogTitle: () => event.value?.title,
    ogDescription: () => event.value?.description,
    ogImage: () => imageUrl.value,
    twitterCard: 'summary_large_image'
  })
  useHead({
    link: [{ rel: 'canonical', href: () => `https://lausannedeter.ch/calendrier/${event.value?.slug}` }],
    script: [{
      type: 'application/ld+json',
      children: () => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.value?.title,
        "startDate": event.value?.startDate
      })
    }]
  })
</script>

<template>
    <section class="event-page">
        <div class="title-container">
            <h3 class="event-title">{{ event.title }}</h3>
            <div class="under-title-container">
                <div class="event-date-container">
                    <span class="event-date-day">{{ new Date(event.startDate).toLocaleDateString('fr-CH', {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) }}</span> |
                    <span class="event-date-time">
                        {{ new Date(event.startDate).toLocaleTimeString('fr-CH', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) }}
                    </span>
                </div>
                <span class="event-location">{{ event.location }}</span>
                <span class="event-organizer">{{ event.organizer }}</span>
            </div>
        </div>

        <img v-if="imageUrl" :src="imageUrl" :alt="event.title" class="event-image">

        <p class="event-description" v-html="event.description"></p>

        <div v-if="event.link" class="usefull-links">
            <h3 class="links-title">Liens utiles:</h3>
            <div class="links-container">
                <a :href="event.link" target="_blank" class="link">{{ event.organizer }}</a>
            </div>
        </div>

        <nuxt-link to="/calendrier" class="button">Retour au calendrier</nuxt-link>
    </section>
</template>

<style scoped>
.event-page {
    padding: 50px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.title-container {
    width: 100%;
}

.event-title {
    font-family: "Azeret Medium";
    font-size: 24px;
}

.under-title-container {
    font-size: 14px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.event-date-day {
}

.event-location {
}

.event-organizer {
}

.event-image {
    width: 75%;
    max-width: 600px;
    height: auto;
}

.event-description {
    font-size: 14px;
    width: 100%;
    white-space: pre-wrap;
}

.event-description :deep(a) {
    text-decoration: underline;
}

.usefull-links {
    width: 100%;
}

.links-title {
    font-size: 14px;
    font-family: "Azeret Medium";
    margin-bottom: 10px;
}

.links-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.link {
    font-size: 14px;
    text-decoration: underline;
    width: fit-content;
}

/* TABLETTE */
@media (min-width: 750px) {

    .event-page {
    padding: 50px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}
}

/* DESKTOP */
@media (min-width: 1200px) {

    .event-page {
    padding: 50px 144px;
}
}
</style>
