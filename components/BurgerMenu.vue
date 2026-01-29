<script setup>
const { isOpen, close } = useMenu()
</script>

<template>
    <!-- Overlay -->
    <div v-if="isOpen" class="overlay" @click="close"></div>

    <transition name="slide">
        <!-- Menu -->
        <div v-if="isOpen" class="menu">
            <img src="/icons/menu-cross.png" alt="cross-icon" class="close" @click="close">

            <nav>
                <nuxt-link to="/calendrier" active-class="active" @click="close">Calendrier</nuxt-link>
                <nuxt-link to="/collectifs" active-class="active" @click="close">Collectifs</nuxt-link>
                <nuxt-link to="/lieux" active-class="active" @click="close">Lieux</nuxt-link>
                <nuxt-link to="/a-propos" active-class="active" @click="close">À propos</nuxt-link>
            </nav>
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
}

.active {
    font-family: "Azeret Medium";
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
