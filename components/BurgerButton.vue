<script setup>
const { toggle } = useMenu()
</script>

<template>
    <div class="button-container">
        <img src="/icons/menu-toggle.png" alt="burger-icon" class="burger-button" @click="toggle">
    </div>
</template>

<style scoped>
.button-container {
    display: flex;
    align-items: center;
}

.burger-button {
    cursor: pointer;
}
</style>