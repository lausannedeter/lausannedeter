<script setup>

const props = defineProps({
    categories: {
        type: Array
    },
    activeFilters: {
        type: Array
    }
})

</script>

<template>
    <div class="filters-container">
        <div class="filter-button deselect" style="border: 2px solid white" @click="$emit('toggleAllFilters')"><span>Tous les filtres</span></div>
        <div v-for="(category, index) in categories" :key="category.id" class="filter-button" :class="{unselected: activeFilters.includes(category.id)}"
            :style="{ backgroundColor: category.color, border: `2px solid ${category.color}` }"
            @click="$emit('toggleFilters', category.id)">
            <span>{{ category.label }}</span>
        </div>
    </div>
</template>

<style scoped>
.filters-container {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
}

.filter-button {
    width: calc(50% - 4px - 20px);
    padding: 10px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.unselected {
    background-color: white !important;
}
</style>