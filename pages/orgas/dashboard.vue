<script setup>
import OrgasDashboardCalendarsDisplay from '~/components/OrgasDashboardCalendarsDisplay.vue';

definePageMeta({ middleware: "auth" });

const api = useApi();
const router = useRouter();

const user = useState("user");
const isSuperAdmin = computed(() => user.value?.role === "superadmin");

const { data: _events, refresh: refreshEvents } = await useAsyncData(
  `org-events`,
  () => api.get(isSuperAdmin.value ? "/api/events" : "/api/events/me"),
  {
    server: false
  }
);
const events = computed(() => _events.value?.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) ?? []);
const eventsUpcoming = computed(() => _events.value?.data.filter((event) => !isPast(event.endDate)).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) ?? [])
const eventsPast = computed(() => _events.value?.data.filter((event) => isPast(event.endDate)).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) ?? [])
const eventsRepetitions = computed(() => {
  const events = _events.value?.data ?? []

  // Compter les occurrences par title
  const countByTitle = events.reduce((acc, event) => {
    acc[event.title] = (acc[event.title] || 0) + 1
    return acc
  }, {})

  // Filtrer ceux présents au moins 2 fois + tri
  return events
    .filter(event => 
      countByTitle[event.title] >= 2
    )
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
})

const { data: _categories } = await useAsyncData('categories', () =>
  api.get('/api/categories'),
);
const categories = _categories.value.data ?? [];
const categoryMap = createCategoryMap(categories ?? []);

const { data: _affiches, refresh: refreshAffiches } = await useAsyncData('affiches', () =>
  api.get('/api/affiches')
);
const affiches = computed(() => _affiches.value.data ?? []);

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

async function deleteCalendar(id) {
  if (!confirm("Supprimer ce calendrier ?")) return;
  deleting.value = id;
  try {
    await api.del(`/api/affiches/${id}`);
    //Refresh affiche ici??
  } finally {
    deleting.value = null;
  }
}

async function logout() {
  await api.post("/api/auth/logout", {}, {
    withCredentials: true
  });
  user.value = null;
  router.push("/");
}

const activeTab = ref("eventsUpcoming")
function changeActiveTab(tab) {
  if (activeTab.value !== tab) {
    activeTab.value = tab
  }
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

    <div class="tab-container">
      <div class="event-tab tab-button" :class="{active : activeTab === 'eventsUpcoming'}"  @click="changeActiveTab('eventsUpcoming')">
        Évènements Futurs
      </div>
      <div class="event-tab tab-button" :class="{active : activeTab === 'eventsPast'}"  @click="changeActiveTab('eventsPast')">
        Évènements Passés
      </div>
      <div class="event-tab tab-button" :class="{active : activeTab === 'repetitions'}"  @click="changeActiveTab('repetitions')">
        Évènements à répétition
      </div>
      <div v-if="isSuperAdmin" class="calendar-tab tab-button" :class="{active : activeTab === 'calendars'}"  @click="changeActiveTab('calendars')">
        Calendriers
      </div>
    </div>

    <div class="tab-content-container">
      <OrgasDashboardEventsUpcomingDisplay v-if="activeTab === 'eventsUpcoming'" :events="eventsUpcoming" :categoryMap="categoryMap"
      @delete="deleteEvent"></OrgasDashboardEventsUpcomingDisplay>
      <orgas-dashboard-events-past-display v-if="activeTab === 'eventsPast'" :events="eventsPast" :categoryMap="categoryMap" @delete="deleteEvent"></orgas-dashboard-events-past-display>
      <orgas-dashboard-repetitions v-if="activeTab === 'repetitions'" :events="eventsRepetitions" :categoryMap="categoryMap" @delete="deleteEvent"></orgas-dashboard-repetitions>
      <orgas-dashboard-calendars-display v-if="activeTab === 'calendars' && isSuperAdmin" :affiches="affiches" @delete="deleteCalendar"></orgas-dashboard-calendars-display>
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

.tab-container {
  display: flex;
  width: fit-content;
  margin-top: -36px;
  border-right: solid #e0e0e0 1px;
}

.tab-button {
  font-size: 14px;
  cursor: pointer;
  padding: 10px 20px;
  border-left: solid #e0e0e0 1px;
  border-bottom: solid #e0e0e0 1px;
}

.tab-button.active {
  font-family: Azeret Medium;
}

/* Tablet */
@media (min-width: 750px) {}
</style>
