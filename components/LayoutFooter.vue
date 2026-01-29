<script setup>
</script>

<template>
    <footer>
        <nuxt-link class="footer-title-link-container" to="/">
            <div class="footer-title-container">
                <img class="logo" src="/Logo-red-circle.png" alt="Logo">
                <h1 class="title">Lausanne Deter</h1>
            </div>
        </nuxt-link>
        <nav class="footer-menu-container">
            <nuxt-link to="/calendrier" active-class="active">Calendrier</nuxt-link>
            <nuxt-link to="/collectifs" active-class="active">Collectifs</nuxt-link>
            <nuxt-link to="/lieux" active-class="active">Lieux</nuxt-link>
            <nuxt-link to="/a-propos" active-class="active">À propos</nuxt-link>
        </nav>
        <a class="mail-link" href="mailto:lausannedeter@proton.me">lausannedeter@proton.me</a>
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
</style>