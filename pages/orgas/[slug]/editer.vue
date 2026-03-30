<script setup>
definePageMeta({ middleware: "auth" })
const api = useApi()
const router = useRouter()
const route = useRoute()
const id = route.params.slug
const status = ref(null)
const errorMessage = ref("")

const { data: _event } = await useAsyncData('edit-event', () => api.get(`/api/events/${id}`))
const eventData = computed(() => _event.value?.data ?? undefined)

const { data: _affiche } = await useAsyncData('edit-affiche', () => api.get(`/api/affiches/${id}`))
const afficheData = computed(() => _affiche.value?.data ?? undefined)

console.log(eventData.value)
console.log(afficheData.value)

async function handleSave(form) {
  status.value = 'saving'
  try {
    if (eventData.value) {
      await api.put(`/api/events/${id}`, form)
    }
    else if (afficheData.value) {
      await api.put(`/api/affiches/${id}`, form)
    }
    status.value = 'success'
    setTimeout(() => router.push('/orgas/dashboard'), 1200)
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Erreur.'
  }
}

async function handleDelete() {
  if (!confirm('Supprimer ?')) return
  if (eventData.value) {
    await api.del(`/api/events/${id}`)
  }
  else if (afficheData.value) {
    await api.del(`/api/affiches/${id}`)
  }
  router.push('/orgas/dashboard')
}
</script>

<template>
  <section class="editor-page">
    <div class="editor-header"><!-- title block --></div>
    <EventForm v-if="eventData" :initial-data="eventData" :loading="!eventData" :saving="status === 'saving'"
      :show-delete="true" :status="status" :error-message="errorMessage" @submit="handleSave" @delete="handleDelete" />
    <CalendarForm v-else-if="afficheData" :initial-data="afficheData" :loading="!afficheData"
      :saving="status === 'saving'" :show-delete="true" :status="status" :error-message="errorMessage"
      @submit="handleSave" @delete="handleDelete" />
  </section>
</template>