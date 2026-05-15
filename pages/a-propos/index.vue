<script setup>
const localePath = useLocalePath()

useSeoMeta({
        title: 'À propos – Lausanne Deter',
        description: 'En savoir plus sur notre collectif et notre démarche à Lausanne.',
        ogTitle: 'À propos',
        ogDescription: 'Qui sommes-nous et pourquoi ce projet ?',
        ogImage: `https://lausannedeter.ch/Logo-red-circle.png`
})

useHead({
        link: [
                {
                        rel: 'canonical',
                        href: `https://lausannedeter.ch/a-propos`
                }
        ]
})
</script>

<template>
        <section class="about-page">
                <div class="section-container">
                        <div class="title-container">
                                <div class="title qui">
                                        <h2>{{ $t("about.qui.title") }}</h2>
                                </div>
                                <div class="slider1"></div>
                        </div>
                        <div class="descr">
                                <p>{{ $t("about.qui.paragraph.part1") }}<b>Lausanne Deter</b>{{
                                        $t("about.qui.paragraph.part2") }} <br><br>
                                        {{ $t("about.qui.paragraph.part3") }}</p>
                        </div>
                </div>

                <div class="section-container">
                        <div class="title-container right">
                                <div class="title pq">
                                        <h2>{{ $t("about.pourquoi.title") }}</h2>
                                </div>
                                <div class="slider2"></div>
                        </div>
                        <div class="descr">
                                <p>{{ $t("about.pourquoi.paragraph.part1") }} <br><br> {{
                                        $t("about.pourquoi.paragraph.part2") }}</p>
                        </div>
                </div>


                <div class="section-container">
                        <div class="title-container">
                                <div class="title com">
                                        <h2>{{ $t("about.comment.title") }}</h2>
                                </div>
                                <div class="slider3"></div>
                        </div>
                        <div class="descr">
                                <p>
                                        {{ $t("about.comment.paragraph.part1") }}
                                        <b><a href="mailto:lausannedeter@proton.me">lausannedeter@proton.me</a></b>
                                        {{ $t("about.comment.paragraph.part2") }}
                                        <b><a href="https://www.instagram.com/lsn.dtr/"
                                                        target="_blank">@lsn.dtr</a></b>.
                                        <br><br>
                                        {{ $t("about.comment.paragraph.part3") }}
                                </p>
                        </div>
                </div>

                <nuxt-link :to="localePath('/calendrier')" class="button">{{ $t("about.seeCalendarButton") }}</nuxt-link>
        </section>
</template>

<style scoped>
.about-page {
        padding: 50px 0;
        display: flex;
        flex-direction: column;
        gap: 50px;
}

.section-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
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
}

.title h2 {
        font-size: 30px;
}

.descr {
        margin: auto;
        font-size: 14px;
        padding: 0 24px;
}

.qui {
        background-color: #52BFEA;

        justify-content: right;
}

.slider1 {
        background-color: #90E0F3;

        width: calc(100% - 20px);
        height: 20px;
        justify-content: right;
}

.right {
        align-self: end;
        align-items: end;
}

.pq {
        background-color: #A8BA9A;
}

.slider2 {
        background-color: #ACE894;
        width: calc(100% - 20px);
        height: 20px;
}

.com {
        background-color: #FA41AE;
        justify-content: right;
}

.slider3 {
        background-color: #F4BFDB;

        width: calc(100% - 20px);
        height: 20px;
        justify-content: right;

}

.button {
        align-self: center;
}

/* TABLETTE */
@media (min-width: 750px) {

        .descr {
                padding: 0 72px;
        }
}

/* DESKTOP */
@media (min-width: 1200px) {

        .descr {
                padding: 0 144px;
        }
}
</style>