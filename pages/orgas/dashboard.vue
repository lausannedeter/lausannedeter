<script setup>
definePageMeta({ middleware: "auth" });

const api = useApi();
const router = useRouter();

const user = useState("user");
const isSuperAdmin = computed(() => user.value?.role === "superadmin");

const { data: _events, refresh: refreshEvents } = await useAsyncData(
  "org-events",
  () => api.get(isSuperAdmin.value ? "/api/events" : "/api/orgas/me/events"),
);
const events = computed(() => _events.value?.data ?? []);

const deleting = ref(null);
async function deleteEvent(id) {
  if (!confirm("Supprimer cet évènement ?")) return;
  deleting.value = id;
  try {
    await api.del(`/api/events/${id}`);
    await refreshEvents();
  } finally {
    deleting.value = null;
  }
}

async function logout() {
  await api.post("/api/auth/logout");
  user.value = null;
  router.push("/login");
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
  <section class="dashboard-page">
    <div class="dash-header">
      <div class="org-identity">
        <div class="title-block">
          <div class="title-main">
            <h2 class="title">
              {{ user?.name ?? user?.email ?? "Mon organisation" }}
            </h2>
          </div>
          <div class="title-sub"></div>
        </div>
        <p class="org-email">
          {{ user?.email }}
          <span v-if="isSuperAdmin" class="role-badge">superadmin</span>
        </p>
      </div>
      <button class="button logout-btn" @click="logout">Déconnexion</button>
    </div>

    <div class="divider"></div>

    <div class="actions-row">
      <nuxt-link class="button action-btn" to="/orgas/new-event">
        + Ajouter un évènement
      </nuxt-link>
    </div>

    <div class="events-section">
      <h3 class="section-label">Mes évènements</h3>

      <div v-if="events.length === 0" class="empty-state">
        <p>Aucun évènement pour l'instant.</p>
        <nuxt-link class="register-link" to="/orgas/new-event">
          Créer ton premier évènement →
        </nuxt-link>
      </div>

      <div v-else class="events-list">
        <div
          v-for="event in events"
          :key="event.id"
          class="event-row"
          :class="{ 'event-row--past': isPast(event.datetime) }"
        >
          <div class="event-info">
            <span class="event-title">{{ event.title }}</span>
            <span class="event-meta">
              {{ formatDate(event.datetime) }}
              <span v-if="event.location"> · {{ event.location }}</span>
            </span>
          </div>

          <div class="event-actions">
            <nuxt-link
              class="icon-btn"
              :to="`/orgas/${event._id}/editer`"
              title="Modifier"
            >
              ✎
            </nuxt-link>
            <button
              class="icon-btn icon-btn--danger"
              :disabled="deleting === event._id"
              title="Supprimer"
              @click="deleteEvent(event._id)"
            >
              <span v-if="deleting === event.id" class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
              <span v-else>✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.org-identity {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-block {
  display: flex;
  flex-direction: column;
  width: fit-content;
}

.title-main {
  background-color: #52bfea;
  padding: 10px 20px;
}

.title {
  font-size: 26px;
}

.title-sub {
  background-color: #90e0f3;
  height: 14px;
  width: calc(100% - 20px);
}

.org-email {
  font-size: 12px;
  color: #666;
  font-family: "Azeret Thin Italic";
  padding-left: 2px;
}

.logout-btn {
  background-color: transparent;
  color: #cd523c;
  border: 1px solid #cd523c;
  font-size: 12px;
  padding: 8px 16px;
  cursor: pointer;
  font-family: "Azeret Medium";
  transition:
    background-color 0.15s,
    color 0.15s;
  align-self: flex-start;
}

.logout-btn:hover {
  background-color: #cd523c;
  color: white;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
}

.actions-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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
  border-bottom: 1px solid #e0e0e0;
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

.role-badge {
  display: inline-block;
  background-color: #cd523c;
  color: white;
  font-family: "Azeret Medium";
  font-size: 10px;
  padding: 2px 7px;
  margin-left: 8px;
  vertical-align: middle;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
