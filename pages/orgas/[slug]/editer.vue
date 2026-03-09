<script setup>
definePageMeta({ middleware: "auth" })
const api = useApi()
const router = useRouter()
const route = useRoute()
const id = route.params.slug
const status = ref(null)
const errorMessage = ref("")

const { data: _event } = await useAsyncData('edit-event', () => api.get(`/api/events/${id}`))
const eventData = computed(() => _event.value?.data)

async function handleSave(form) {
  status.value = 'saving'
  try {
    await api.put(`/api/events/${id}`, form)
    status.value = 'success'
    setTimeout(() => router.push('/orgas/dashboard'), 1200)
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Erreur.'
  }
}

async function handleDelete() {
  if (!confirm('Supprimer ?')) return
  await api.del(`/api/events/${id}`)
  router.push('/orgas/dashboard')
}
</script>

<template>
  <section class="editor-page">
    <div class="editor-header"><!-- title block --></div>
    <EventForm
      :initial-data="eventData"
      :loading="!eventData"
      :saving="status === 'saving'"
      :show-delete="true"
      :status="status"
      :error-message="errorMessage"
      @submit="handleSave"
      @delete="handleDelete"
    />
  </section>
</template>
