<script setup>
definePageMeta({ middleware: "auth" })
const api = useApi()
const router = useRouter()
const status = ref(null)
const errorMessage = ref("")

async function handleCreate(form) {
  status.value = 'saving'
  try {
    await api.post('/api/events', form)
    status.value = 'success'
    setTimeout(() => router.push('/orgas/dashboard'), 1200)
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Erreur.'
  }
}
</script>

<template>
  <section class="editor-page">
    <EventForm
      :saving="status === 'saving'"
      :status="status"
      :error-message="errorMessage"
      @submit="handleCreate"
    >
      <template #submit-label>Créer l'évènement</template>
      <template #success-message>Évènement créé !</template>
    </EventForm>
  </section>
</template>