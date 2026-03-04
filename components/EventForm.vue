<script setup>
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  showDelete: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'delete'])

const api = useApi()
const { data: _categories } = await useAsyncData('event-form-categories', () => api.get('/api/categories'))
const categories = computed(() => _categories.value?.data ?? [])

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
  const e = props.initialData
  if (!e || !e.title) return
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

function handleSubmit() {
  emit('submit', {
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
}
</script>

<template>
  <div class="event-form-wrapper">
        <div class="button-container">
      <nuxt-link to="/orgas/dashboard" class="back-button">Retour</nuxt-link>
    </div>

    <div v-if="status === 'success'" class="banner banner--success">
      ✓ <slot name="success-message">Évènement enregistré.</slot>
    </div>
    <div v-if="status === 'error'" class="banner banner--error">
      ✗ {{ errorMessage }}
    </div>

    <div v-if="loading" class="loading-state">Chargement…</div>

    <form v-else class="editor-form" @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">

        <div class="field field--full">
          <label class="label" for="ef-title">Titre <span class="req">*</span></label>
          <input id="ef-title" v-model="form.title" class="input" type="text" required />
        </div>

        <div class="field field--full">
          <label class="label" for="ef-description">Description</label>
          <textarea id="ef-description" v-model="form.description" class="input textarea" rows="4" />
        </div>

        <div class="field">
          <label class="label" for="ef-startDate">Date de début <span class="req">*</span></label>
          <input id="ef-startDate" v-model="form.startDate" class="input" type="datetime-local" required />
        </div>

        <div class="field">
          <label class="label" for="ef-endDate">Date de fin</label>
          <input id="ef-endDate" v-model="form.endDate" class="input" type="datetime-local" />
        </div>

        <div class="field">
          <label class="label" for="ef-organizer">Organisateur·ice <span class="req">*</span></label>
          <input id="ef-organizer" v-model="form.organizer" class="input" type="text" required />
        </div>

        <div class="field">
          <label class="label" for="ef-location">Lieu</label>
          <input id="ef-location" v-model="form.location" class="input" type="text" />
        </div>

        <div class="field">
          <label class="label" for="ef-category">Catégorie <span class="req">*</span></label>
          <select id="ef-category" v-model="form.category" class="input select" required>
            <option value="" disabled>Choisir…</option>
            <option v-for="cat in categories" :key="cat.id ?? cat._id" :value="cat.id ?? cat._id">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label class="label" for="ef-link">Lien (optionnel)</label>
          <input id="ef-link" v-model="form.link" class="input" type="url" placeholder="https://…" />
        </div>

        <div class="field field--full">
          <label class="label" for="ef-image">Nom du fichier image (optionnel)</label>
          <input id="ef-image" v-model="form.image" class="input" type="text" placeholder="nom-du-fichier.jpg" />
        </div>

      </div>

      <div class="form-footer">
        <button
          v-if="showDelete"
          type="button"
          class="button delete-btn"
          @click="$emit('delete')"
        >
          Supprimer l'évènement
        </button>
        <div v-else></div>

        <button
          type="submit"
          class="button submit-btn"
          :disabled="saving || status === 'success'"
        >
          <span v-if="saving" class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
          <span v-else><slot name="submit-label">Enregistrer</slot></span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.banner {
  padding: 10px 16px;
  font-family: "Azeret Medium";
  font-size: 12px;
  margin-bottom: 8px;
}
.banner--success { background-color: #ace894; color: #1a4a0a; }
.banner--error { background-color: #f5c6be; color: #7a1a0a; }

.loading-state {
  font-size: 13px;
  color: #888;
  padding: 40px 0;
}

.back-button {
  display: inline-flex;
  align-items: center;
  background-color: #CD523C;
  color: white;
  font-family: "Azeret Medium";
  font-size: 12px;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.15s;
  margin-bottom: 2rem;
}

.back-button:hover {
  background-color: #b8432e;
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

.field--full { grid-column: 1 / -1; }

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
  .form-grid { grid-template-columns: 1fr; }
  .field--full { grid-column: 1; }
}
</style>