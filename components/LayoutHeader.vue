<script setup>
</script>

<template>
    <header>
        <nuxt-link to="/">
            <div class="header-title-container">
                <img class="logo" src="/Logo-inverted-circle.png" alt="Logo">
                <h1 class="title">Lausanne Deter</h1>
            </div>
        </nuxt-link>
        <BurgerButton></BurgerButton>
    </header>
</template>

<style scoped>
header {
    background-color: #CD523C;
    display: flex;
    justify-content: space-between;
    padding: 10px 24px;
    position: fixed;
    width: calc(100% - 48px);
    top: 0;
}

.header-title-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.title {
    font-size: 30px;
}

.logo {
    width: 50px;
}
</style>