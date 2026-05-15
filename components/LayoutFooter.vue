<script setup>
const localePath = useLocalePath()
</script>

<template>
    <footer>
        <nuxt-link class="footer-title-link-container" :to="localePath('/')">
            <div class="footer-title-container">
                <img class="logo" src="/Logo-red-circle.png" alt="Logo">
                <h1 class="title">Lausanne Deter</h1>
            </div>
        </nuxt-link>
        <nav class="footer-menu-container">
            <nuxt-link :to="localePath('/calendrier')" active-class="active">{{ $t("nav.calendrier") }}</nuxt-link>
            <nuxt-link :to="localePath('/archives')" active-class="active">{{ $t("nav.archives") }}</nuxt-link>
            <nuxt-link :to="localePath('/copaines')" active-class="active">{{ $t("nav.copaines") }}</nuxt-link>
            <nuxt-link :to="localePath('/a-propos')" active-class="active">{{ $t("nav.about") }}</nuxt-link>
        </nav>
        <a class="mail-link" href="mailto:lausannedeter@proton.me" target="_blank">lausannedeter@proton.me</a>
        <a class="insta-link" href="https://www.instagram.com/lsn.dtr/?hl=fr" target="_blank">@lsn.dtr</a>
    </footer>
</template>

<style scoped>
footer {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px 24px;
    background-color: #1A160F;
}

footer * {
    color: white;
}

.footer-title-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-title-link-container {
    width: fit-content;
    align-self: center;
}

.logo {
    width: 50px;
}

.title {
    font-size: 30px;
}

.footer-menu-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    text-transform: uppercase;
    flex-wrap: wrap;
}

.active {
    font-family: "Azeret Medium";
}

.mail-link {
    width: fit-content;
    align-self: center;
}

.insta-link {
    width: fit-content;
    align-self: center;
}
</style>