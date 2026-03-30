<script setup>
definePageMeta({ middleware: "auth" })
const api = useApi()
const cloudinary = useCloudinary()
const router = useRouter()
const status = ref(null)
const errorMessage = ref("")

async function handleCreate(form) {
  status.value = 'saving'
  //pdf
  const file = form.linkFile
  const fileName = form.link
  delete form.linkFile
  //preview image
  const previewFile = form.preview_linkFile
  const previewFileName = form.preview_link
  delete form.preview_linkFile

  try {
    if (file && fileName) {
      await cloudinary.upload(file, fileName)
    }
    if (previewFile && previewFileName) {
        await cloudinary.upload(previewFile, previewFileName)
    }
    await api.post('/api/affiches', form)
    status.value = 'success'
    setTimeout(() => router.push('/orgas/dashboard'), 1200)
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Erreur inconnue.'
    console.error(err)
  }
}
</script>

<template>
  <section class="editor-page">
    <CalendarForm
      :saving="status === 'saving'"
      :status="status"
      :error-message="errorMessage"
      @submit="handleCreate"
    >
      <template #submit-label>Créer le calendrier</template>
      <template #success-message>Calendrier créé !</template>
    </CalendarForm>
  </section>
</template>
