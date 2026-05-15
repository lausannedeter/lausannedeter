<script setup>
const { isOpen, close } = useMenu()

const { locales, setLocale, locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
    <!-- Overlay -->
    <div v-if="isOpen" class="overlay" @click="close"></div>

    <transition name="slide">
        <!-- Menu -->
        <div v-if="isOpen" class="menu">
            <img src="/icons/menu-cross.png" alt="cross-icon" class="close" @click="close">
            <div class="lang-container">
                <button v-for="localeI in locales" :class="{ active: locale === localeI.code }"
                    @click="setLocale(localeI.code)">
                    {{ localeI.name }}
                </button>
            </div>

            <nav>
                <nuxt-link :to="localePath('/calendrier')" active-class="active" @click="close">{{ $t("nav.calendrier") }}</nuxt-link>
                <nuxt-link :to="localePath('/archives')" active-class="active" @click="close">{{ $t("nav.archives") }}</nuxt-link>
                <nuxt-link :to="localePath('/copaines')" active-class="active" @click="close">{{ $t("nav.copaines") }}</nuxt-link>
                <nuxt-link :to="localePath('/a-propos')" active-class="active" @click="close">{{ $t("nav.about") }}</nuxt-link>
            </nav>

            <nuxt-link :to="localePath('/orgas')" class="orgas-button" @click="close">{{ $t("nav.espaceOrgas") }}</nuxt-link>
        </div>
    </transition>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
}

.menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 80vw;
    max-width: 240px;
    height: 100vh;
    background: #CD523C;
    color: black;
    padding: 24px;
    z-index: 1000;
}

.lang-container {
    display: flex;
    margin-top: 24px;
    margin-bottom: 100px;
    gap: 1.5rem;
}

.lang-container button {
    font-family: "Azeret Thin";
    font-size: 16px;
    background-color: transparent;
    color: black;
    border: none;
    cursor: pointer;
}

.close {
    background: none;
    border: none;
    font-size: 24px;
    position: absolute;
    top: 24px;
    right: 24px;
    cursor: pointer;
}

nav {
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-transform: uppercase;
    width: fit-content;
}

.active {
    font-family: "Azeret Medium" !important;
}

.orgas-button {
    position: absolute;
    bottom: 150px;
    padding: 10px 20px;
    font-family: "Azeret Medium";
    font-size: 12px;
    background-color: white;
    color: #CD523C;
}

/* Transition slide depuis la droite */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
