<script setup>
definePageMeta({ middleware: "auth" })

const api = useApi()
const router = useRouter()
const route = useRoute()

const slug = route.params.slug
const status = ref(null) // null | 'loading' | 'saving' | 'success' | 'error'
const errorMessage = ref("")

const { data: _categories } = await useAsyncData('edit-categories', () => api.get('/api/categories'))
const categories = computed(() => _categories.value?.data ?? [])

const { data: _event } = await useAsyncData('edit-event', () => api.get(`/api/events/${slug}`))
const eventId = computed(() => _event.value?.data?._id)
console.log(_event.value.data)

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  organizer: '',
  location: '',
  link: '',
  category: '',
  image: '',
})

watchEffect(() => {
  const e = _event.value?.data
  if (!e) return
  form.title = e.title ?? ''
  form.description = e.description ?? ''
  form.startDate = e.startDate ? e.startDate.slice(0, 16) : ''
  form.endDate = e.endDate ? e.endDate.slice(0, 16) : ''
  form.organizer = e.organizer ?? ''
  form.location = e.location ?? ''
  form.link = e.link ?? ''
  form.category = e.category ?? ''
  form.image = e.image ?? ''
})

async function handleSave() {
  status.value = 'saving'
  errorMessage.value = ''
  try {
    await api.put(`/api/events/${eventId.value}`, {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      organizer: form.organizer,
      location: form.location,
      link: form.link || undefined,
      category: form.category,
      image: form.image || undefined,
    })
    status.value = 'success'
    setTimeout(() => router.push('/orgas/dashboard'), 1200)
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Une erreur est survenue.'
  }
}

async function handleDelete() {
  if (!confirm('Supprimer définitivement cet évènement ?')) return
  try {
    await api.del(`/api/events/${eventId.value}`)
    router.push('/orgas/dashboard')
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err?.data?.message ?? 'Erreur lors de la suppression.'
  }
}
</script>

<template>
  <section class="editor-page">

    <div class="editor-header">
      <div class="title-block">
        <div class="title-main">
          <h2 class="title">Modifier l'évènement</h2>
        </div>
        <div class="title-sub"></div>
      </div>
      <nuxt-link class="back-link" to="/orgas/dashboard">← Retour</nuxt-link>
    </div>

    <div v-if="status === 'success'" class="banner banner--success">
      ✓ Évènement mis à jour. Redirection…
    </div>
    <div v-if="status === 'error'" class="banner banner--error">
      ✗ {{ errorMessage }}
    </div>

    <div v-if="!_event?.data" class="loading-state">
      Chargement…
    </div>

    <form v-else class="editor-form" @submit.prevent="handleSave" novalidate>

      <div class="form-grid">

        <div class="field field--full">
          <label class="label" for="title">Titre <span class="req">*</span></label>
          <input id="title" v-model="form.title" class="input" type="text" required @input="status = null" />
        </div>

        <div class="field field--full">
          <label class="label" for="description">Description</label>
          <textarea id="description" v-model="form.description" class="input textarea" rows="4" @input="status = null" />
        </div>

        <div class="field">
          <label class="label" for="startDate">Date de début <span class="req">*</span></label>
          <input id="startDate" v-model="form.startDate" class="input" type="datetime-local" required @input="status = null" />
        </div>

        <div class="field">
          <label class="label" for="endDate">Date de fin</label>
          <input id="endDate" v-model="form.endDate" class="input" type="datetime-local" @input="status = null" />
        </div>

        <div class="field">
          <label class="label" for="organizer">Organisateur·ice <span class="req">*</span></label>
          <input id="organizer" v-model="form.organizer" class="input" type="text" required @input="status = null" />
        </div>

        <div class="field">
          <label class="label" for="location">Lieu</label>
          <input id="location" v-model="form.location" class="input" type="text" @input="status = null" />
        </div>

        <div class="field">
          <label class="label" for="category">Catégorie <span class="req">*</span></label>
          <select id="category" v-model="form.category" class="input select" required @change="status = null">
            <option value="" disabled>Choisir…</option>
            <option v-for="cat in categories" :key="cat.id ?? cat._id" :value="cat.id ?? cat._id">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label class="label" for="link">Lien (optionnel)</label>
          <input id="link" v-model="form.link" class="input" type="url" placeholder="https://…" @input="status = null" />
        </div>

        <div class="field field--full">
          <label class="label" for="image">Nom du fichier image (optionnel)</label>
          <input id="image" v-model="form.image" class="input" type="text" placeholder="nom-du-fichier.jpg" @input="status = null" />
        </div>

      </div>

      <div class="form-footer">
        <button type="button" class="button delete-btn" @click="handleDelete">
          Supprimer l'évènement
        </button>
        <button type="submit" class="button submit-btn" :disabled="status === 'saving' || status === 'success'">
          <span v-if="status === 'saving'" class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
          <span v-else>Enregistrer</span>
        </button>
      </div>

    </form>

  </section>
</template>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 800px;
}

.editor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
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

.title { font-size: 24px; }

.title-sub {
  background-color: #90e0f3;
  height: 14px;
  width: calc(100% - 20px);
}

.back-link {
  font-size: 11px;
  color: #888;
  text-decoration: underline;
  font-family: "Azeret Thin Italic";
  align-self: center;
}

.banner {
  padding: 10px 16px;
  font-family: "Azeret Medium";
  font-size: 12px;
}
.banner--success { background-color: #ace894; color: #1a4a0a; }
.banner--error { background-color: #f5c6be; color: #7a1a0a; }

.loading-state {
  font-size: 13px;
  color: #888;
  padding: 40px 0;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field--full {
  grid-column: 1 / -1;
}

.label {
  font-family: "Azeret Medium";
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.req { color: #CD523C; }

.input {
  border: 1px solid #ccc;
  padding: 10px 14px;
  font-family: "Azeret Thin";
  font-size: 13px;
  background-color: #fafafa;
  color: black;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  -webkit-appearance: none;
  appearance: none;
}

.input:focus {
  border-color: #52bfea;
  background-color: #f0faff;
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

.select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
}

.submit-btn {
  min-width: 160px;
  justify-content: center;
  font-size: 13px;
  padding: 12px 24px;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background-color: transparent;
  color: #cd523c;
  border: 1px solid #cd523c;
  font-size: 12px;
  padding: 10px 20px;
  cursor: pointer;
  font-family: "Azeret Medium";
  transition: background-color 0.15s, color 0.15s;
}

.delete-btn:hover {
  background-color: #cd523c;
  color: white;
}

.loading-dots span {
  animation: blink 1s infinite;
  font-size: 20px;
  line-height: 0;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .field--full {
    grid-column: 1;
  }
}
</style>