<script setup>
const api = useApi();

const { data: _affiches } = await useAsyncData('affiches', () =>
    api.get('/api/affiches'),
);
const affiches = _affiches.value.data.sort((a, b) => new Date(b.monthStart) - new Date(a.monthStart)) ?? [];
console.log(affiches)

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
                <h1>Archives</h1>
            </div>
            <div class="slider"></div>
        </div>
        <p class="archives-intro-text">Retrouvez ici les archives de nos affiches de calendrier disponibles au
            téléchargement.</p>
        <div class="archives-container">
            <div v-for="affiche in affiches" :key="affiche._id" class="affiche-container">
                <div class="month-label-container">
                    <h2 class="month-label">{{ `${affiche.monthLabel} ${new Date(affiche.monthStart).getFullYear()}` }}
                    </h2>
                </div>
                <div class="preview-container">
                    <a :href="`/affiches/${affiche.link}`" download>
                        <PdfPreview :pdfUrl="`/affiches/${affiche.link}`" />
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
    justify-content: center;
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