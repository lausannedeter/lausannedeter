<script setup>
const uploadedUrl = ref(null)
const fileInput = ref(null)
const imageFile = ref(null)

function toLocalInput(isoStr) {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  // Offset the UTC time by Zurich's offset (+1 or +2 in summer)
  const zurich = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Zurich' }))
  const pad = n => String(n).padStart(2, '0')
  return `${zurich.getFullYear()}-${pad(zurich.getMonth() + 1)}-${pad(zurich.getDate())}T${pad(zurich.getHours())}:${pad(zurich.getMinutes())}`
}

function sanitizeFilename(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

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
  form.startDate = toLocalInput(e.startDate)
  form.endDate = toLocalInput(e.endDate)
  form.organizer = e.organizer ?? ''
  form.location = e.location ?? ''
  form.link = e.link ?? ''
  form.category = e.category ?? ''
  form.image = e.image ?? ''
})

//Adapt endDate to startDate
watchEffect(() => {
  if((form.startDate && !form.endDate) || (form.startDate > form.endDate)) {
    form.endDate = form.startDate
  }
}, [form.startDate])

//Adapt startDate to endDate
watchEffect(() => {
  if(form.endDate && !form.startDate) {
    form.startDate = form.endDate
  }
}, [form.endDate])

function onFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    form.image = sanitizeFilename(file.name) + '.' + ext
    imageFile.value = file
    uploadedUrl.value = URL.createObjectURL(file)
  }
}

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
    imageFile: imageFile.value || undefined,  // add this
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
          <label class="label">Affiche (optionnel)</label>
          <div class="upload-zone" :class="{ 'upload-zone--disabled': loading }" @click="fileInput.click()">
            <input ref="fileInput" accept="image/*" type="file" name="files" :disabled="loading" @change="onFileSelect"
              style="display: none" />
            <template v-if="uploadedUrl">
              <img :src="uploadedUrl" :alt="form.image" class="upload-preview" />
            </template>
            <template v-else-if="form.image">
              <span class="upload-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="upload-text"><span class="upload-cta">{{ form.image }}</span></span>
            </template>
            <template v-else>
              <span class="upload-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="upload-text">Glisser une image ici, ou <span class="upload-cta">parcourir</span></span>
              <span class="upload-hint">PNG, JPG, WEBP</span>
            </template>
          </div>
          <button v-if="form.image" type="button" class="upload-remove"
            @click="form.image = null; imageFile = null; uploadedUrl = null; fileInput.value = ''">
            ✕ Supprimer l'image
          </button>
        </div>

      </div>

      <div class="form-footer">
        <button v-if="showDelete" type="button" class="button delete-btn" @click="$emit('delete')">
          Supprimer l'évènement
        </button>
        <div v-else></div>

        <button type="submit" class="button submit-btn" :disabled="saving || status === 'success'">
          <span v-if="saving" class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
          <span v-else>
            <slot name="submit-label">Enregistrer</slot>
          </span>
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

.banner--success {
  background-color: #ace894;
  color: #1a4a0a;
}

.banner--error {
  background-color: #f5c6be;
  color: #7a1a0a;
}

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

.field--full {
  grid-column: 1 / -1;
}

.label {
  font-family: "Azeret Medium";
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.req {
  color: #CD523C;
}

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

.upload-preview {
  max-height: 140px;
  max-width: 100%;
  object-fit: contain;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px dashed #ccc;
  padding: 28px 20px;
  background-color: #fafafa;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
  position: relative;
  text-align: center;
}

.upload-zone:hover {
  border-color: #CD523C;
  background-color: #fdf5f3;
}

.upload-zone--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.upload-icon {
  color: #aaa;
  transition: color 0.15s;
}

.upload-zone:hover .upload-icon {
  color: #CD523C;
}

.upload-text {
  font-family: "Azeret Thin";
  font-size: 12px;
  color: #555;
}

.upload-cta {
  font-family: "Azeret Medium";
  color: #CD523C;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.upload-hint {
  font-family: "Azeret Thin";
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.upload-remove {
  align-self: flex-start;
  margin-top: 4px;
  background: none;
  border: none;
  padding: 0;
  font-family: "Azeret Medium";
  font-size: 11px;
  color: #cd523c;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  letter-spacing: 0.04em;
}

.upload-remove:hover {
  color: #a33828;
}

.loading-dots span {
  animation: blink 1s infinite;
  font-size: 20px;
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

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .field--full {
    grid-column: 1;
  }
}
</style>
