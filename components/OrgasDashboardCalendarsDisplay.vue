<script setup>
const localePath = useLocalePath()

const { resolve: resolveImage } = useCalendarImage()

const props = defineProps({
    affiches: {
        type: Array
    }
})

const emit = defineEmits(['delete']);

const deleting = ref(null);
async function deleteCalendar(id) {
    deleting.value = id;
    try {
        await emit('delete', id);
    } finally {
        deleting.value = null;
    }
}


const resolvedUrls = ref({})

watchEffect(async () => {
  if (!props.affiches) return

  const map = {}

  for (const affiche of props.affiches) {
    if (affiche.preview_link) {
      map[affiche._id] = await resolveImage(affiche.preview_link)
    }
  }

  resolvedUrls.value = map
})
</script>

<template>
    <div class="calendars-section">
        <div class="actions-row">
            <nuxt-link class="button action-btn" :to="localePath('/orgas/new-calendar')">
                + Ajouter un calendrier
            </nuxt-link>
        </div>

        <h3 class="section-label">Les calendriers</h3>

        <div v-if="affiches.length === 0" class="empty-state">
            <p>Aucun calendrier pour l'instant.</p>
            <nuxt-link class="register-link" :to="localePath('/orgas/new-calendar')">
                Créer ton premier calendrier →
            </nuxt-link>
        </div>

        <div v-else class="calendars-list">
            <div v-for="affiche in affiches" :key="affiche._id" class="calendar-row">
                <div class="calendar-info">
                    <img v-if="resolvedUrls[affiche._id]" :src="resolvedUrls[affiche._id]" :alt="affiche.preview_link" class="calendar-preview">
                    <span class="calendar-title">{{ affiche.monthLabel }}</span>
                </div>

                <div class="calendar-actions">
                    <nuxt-link class="icon-btn" :to="localePath(`/orgas/${affiche._id}/editer`)" title="Modifier">
                        ✎
                    </nuxt-link>
                    <button class="icon-btn icon-btn--danger" :disabled="deleting === affiche._id" title="Supprimer"
                        @click="deleteCalendar(affiche._id)">
                        <span v-if="deleting === affiche._id" class="loading-dots">
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
}

.action-btn {
    font-size: 13px;
    padding: 10px 20px;
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

.calendars-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid #e0e0e0;
}

.calendar-row {
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

.calendar-info {
    display: flex;
    gap: 36px;
}

.calendar-title {
    font-family: "Azeret Medium";
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.calendar-preview {
    height: 100px;
}
.calendar-actions {
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
    .calendar-title {
        font-size: 14px;
    }
}
</style>