<script setup>
const { locales, setLocale, locale } = useI18n()

const { resolve: resolveImage } = useCalendarImage()
const api = useApi();

const { data: _affiches } = await useAsyncData('affiches', () =>
    api.get('/api/affiches'),
);
//Refetch côté client
const { data: _affichesClient } = await useAsyncData('affiches-client', () => api.get('/api/affiches'), { server: false, lazy: true })
const affiches = computed(() => _affichesClient.value?.data ?? _affiches.value?.data ?? [])


const resolvedUrls = ref({})

watchEffect(async () => {
    if (!affiches.value) return

    const map = {}

    for (const affiche of affiches.value) {
        map[affiche._id] = {}

        if (affiche.preview_link) {
            map[affiche._id].preview = await resolveImage(affiche.preview_link)
        }

        if (affiche.link) {
            map[affiche._id].pdf = await resolveImage(`fl_attachment/${affiche.link}`)
        }
    }

    resolvedUrls.value = map
})


useSeoMeta({
    title: 'Archives des calendriers – Lausanne Deter',
    description: 'Consultez les anciens calendriers passés.',
    ogTitle: 'Archives des calendriers',
    ogDescription: 'Historique des calendriers militants passés.',
    ogImage: `https://lausannedeter.ch/Logo-red-circle.png`
})

useHead({
    link: [
        {
            rel: 'canonical',
            href: `https://lausannedeter.ch/archives`
        }
    ]
})
</script>

<template>
    <section class="archives-page">
        <div class="title-container">
            <div class="title">
                <h1>{{ $t("archives.title") }}</h1>
            </div>
            <div class="slider"></div>
        </div>
        <p class="archives-intro-text">{{ $t("archives.paragraph") }}</p>
        <div class="archives-container">
            <div v-for="affiche in affiches" :key="affiche._id" class="affiche-container">
                <div class="month-label-container">
                    <h2 class="month-label">
                        {{ new Date(affiche.monthStart).toLocaleDateString(locale, {
                            month: 'long',
                            year: 'numeric'
                        }) }}
                    </h2>
                </div>
                <div v-if="resolvedUrls[affiche._id]" class="preview-container">
                    <a :href="resolvedUrls[affiche._id].pdf" download>
                        <img :src="resolvedUrls[affiche._id].preview" :alt="affiche.link" class="preview-image">
                    </a>
                    <a class="download-text" :href="resolvedUrls[affiche._id].pdf" download>
                        {{ $t("archives.downloadButton") }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.archives-page {
    padding: 50px 0;
}

.title-container {
    display: flex;
    flex-direction: column;
    width: 60%;
    max-width: 400px;
}

.title {
    width: 100%;
    padding: 10px 20px;
    display: flex;
    background-color: #52BFEA;
    justify-content: right;
}

.slider {
    background-color: #90E0F3;
    width: calc(100% - 20px);
    height: 20px;
    justify-content: right;
}

.archives-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.archives-intro-text {
    padding: 30px 24px;
}

.affiche-container {
    min-height: 300px;
}

.month-label-container {
    background-color: #1A160F;
    display: flex;
    justify-content: end;
    width: 50%;
    max-width: 400px;
    padding: 10px 20px;
}

.month-label {
    color: white;
    font-size: 30px;
    text-transform: capitalize;
}

.preview-container {
    padding: 30px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.preview-image {
    max-width: 100%;
    max-height: 60vh;
}

/* TABLETTE */
@media (min-width: 750px) {

    .archives-intro-text {
        padding: 30px 72px;
    }

    .preview-container {
        padding: 30px 72px;
    }
}

/* DESKTOP */
@media (min-width: 1200px) {

    .archives-intro-text {
        padding: 30px 144px;
    }

    .preview-container {
        padding: 30px 144px;
    }
}
</style>