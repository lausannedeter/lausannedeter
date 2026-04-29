<script setup>
const props = defineProps({
    events: {
        type: Array
    },
    categoryMap: {
        type: Object
    },
})

const emit = defineEmits(['delete']);

const deleting = ref(null);
async function deleteEvent(id) {
    deleting.value = id;
    try {
        await emit('delete', id);
    } finally {
        deleting.value = null;
    }
}

const deletingAll = ref(false)
async function deleteAllPastEvents() {
    deletingAll.value = true
    try {
        console.log("Deleting all")
    } finally {
        deletingAll.value = false
    }
}


function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function isPast(iso) {
    return iso && new Date(iso) < new Date();
}
</script>

<template>
    <div class="events-section">

        <div class="actions-row">
            <nuxt-link class="button action-btn" to="/orgas/new-event">
                + Ajouter un évènement
            </nuxt-link>
            <button class="button action-btn" :disabled="deletingAll" @click="deleteAllPastEvents()">
                <span v-if="deletingAll" class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
                <span v-else>
                    ✕ TOUT SUPPRIMER
                </span>
            </button>
        </div>

        <h3 class="section-label">Mes évènements passés</h3>

        <div v-if="!events || events.length === 0" class="empty-state">
            <p>Aucun évènement pour l'instant.</p>
            <nuxt-link class="register-link" to="/orgas/new-event">
                Créer ton premier évènement →
            </nuxt-link>
        </div>

        <div v-else class="events-list">
            <div v-for="event in events" :key="event._id" class="event-row"
                :class="{ 'event-row--past': isPast(event.endDate) }" :style="{
                    borderLeft: `5px solid ${categoryMap[event.category].color ?? '#ccc'}`
                }">
                <div class="event-info">
                    <span class="event-title">{{ event.title }}</span>
                    <span class="event-meta">
                        {{ formatDate(event.startDate) }}
                        <span v-if="event.location"> · {{ event.location }}</span>
                    </span>
                </div>

                <div class="event-actions">
                    <nuxt-link class="icon-btn" :to="`/orgas/${event._id}/editer`" title="Modifier">
                        ✎
                    </nuxt-link>
                    <button class="icon-btn icon-btn--danger" :disabled="deleting === event._id" title="Supprimer"
                        @click="deleteEvent(event._id)">
                        <span v-if="deleting === event._id" class="loading-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                        <span v-else>✕</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.actions-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 36px;
    justify-content: space-between;
}

.action-btn {
    font-size: 13px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
}

.section-label {
    font-family: "Azeret Medium";
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #555;
    font-weight: normal;
    margin-bottom: 16px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 32px 0;
    color: #888;
    font-size: 13px;
}

.register-link {
    font-family: "Azeret Medium";
    color: #cd523c;
    text-decoration: underline;
    font-size: 13px;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid #e0e0e0;
}

.event-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    padding-left: 5px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 10px;
    transition: background-color 0.1s;
}

.event-row--past {
    opacity: 0.5;
}

.event-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
}

.event-title {
    font-family: "Azeret Medium";
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-meta {
    font-size: 11px;
    color: #888;
    font-family: "Azeret Thin Italic";
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    background: none;
    cursor: pointer;
    font-size: 14px;
    color: #444;
    text-decoration: none;
    transition:
        border-color 0.15s,
        color 0.15s,
        background-color 0.15s;
    font-family: "Azeret Medium";
}

.icon-btn:hover {
    border-color: #52bfea;
    color: #52bfea;
}

.icon-btn--danger:hover {
    border-color: #cd523c;
    color: #cd523c;
}

.icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading-dots span {
    animation: blink 1s infinite;
    font-size: 14px;
    line-height: 0;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {

    0%,
    80%,
    100% {
        opacity: 0;
    }

    40% {
        opacity: 1;
    }
}

/* Tablet */
@media (min-width: 750px) {
    .event-title {
        font-size: 14px;
    }

    .event-meta {
        font-size: 12px;
    }
}
</style>