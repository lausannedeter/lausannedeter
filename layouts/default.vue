<script setup>
import BurgerMenu from '~/components/BurgerMenu.vue';


</script>

<template>
    <LayoutHeader></LayoutHeader>

    <burger-menu></burger-menu>

    <main>
        <slot />
    </main>

    <LayoutFooter></LayoutFooter>
</template>

<style scoped>
main {
    margin-top: 70px;
}
</style>