<script setup>
const linkUploadedUrl = ref(null)
const linkFileInput = ref(null)
const linkFile = ref(null)

const preview_linkUploadedUrl = ref(null)
const preview_linkFileInput = ref(null)
const preview_linkFile = ref(null)

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

const form = reactive({
  monthStart: '',
  monthLabel: '',
  link: '',
  preview_link: '',
})

watchEffect(() => {
  const c = props.initialData
  console.log(c)
  if (!c || !c.monthLabel) return
  form.monthStart = c.monthStart.slice(0, 7) ?? ''
  form.monthLabel = getMonthLabel(c.monthStart) ?? ''
  form.link = c.link ?? ''
  form.preview_link = c.preview_link ?? ''
})

function onLinkFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    form.link = sanitizeFilename(file.name) + '.' + ext
    linkFile.value = file
    linkUploadedUrl.value = URL.createObjectURL(file)
  }
}

function onPreviewLinkFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop().toLowerCase()
    form.preview_link = sanitizeFilename(file.name) + '.' + ext
    preview_linkFile.value = file
    preview_linkUploadedUrl.value = URL.createObjectURL(file)
  }
}

function getMonthLabel(dateStr) {
  const month = new Intl.DateTimeFormat('fr-CH', { month: 'long' }).format(
    new Date(dateStr)
  );

  return month.charAt(0).toUpperCase() + month.slice(1);
}

function handleSubmit() {
  emit('submit', {
    monthStart: new Date(form.monthStart + "-01"),
    monthLabel: getMonthLabel(new Date(form.monthStart + "-01")),
    link: form.link,
    linkFile: linkFile.value || undefined,
    preview_link: form.preview_link,
    preview_linkFile: preview_linkFile.value || undefined
  })
}
</script>

<template>
  <div class="event-form-wrapper">
    <div class="button-container">
      <nuxt-link to="/orgas/dashboard" class="back-button">Retour</nuxt-link>
    </div>

    <div v-if="status === 'success'" class="banner banner--success">
      ✓ <slot name="success-message">Calendrier enregistré.</slot>
    </div>
    <div v-if="status === 'error'" class="banner banner--error">
      ✗ {{ errorMessage }}
    </div>

    <div v-if="loading" class="loading-state">Chargement…</div>

    <form v-else class="editor-form" @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">

        <div class="field">
          <label class="label" for="ef-monthStart">Mois<span class="req">*</span></label>
          <input id="ef-monthStart" v-model="form.monthStart" class="input" type="month" required />
        </div>

        <div class="field field--full">
          <label class="label">PDF du Calendrier<span class="req">*</span></label>
          <div class="upload-zone" :class="{ 'upload-zone--disabled': loading }" @click="linkFileInput.click()">
            <input ref="linkFileInput" accept="application/pdf" type="file" name="file" :disabled="loading"
              @change="onLinkFileSelect" style="display: none" />
            <template v-if="linkUploadedUrl">
              <div class="upload-pdf-preview">
                📄 <span>{{ form.link }}</span>
              </div>
            </template>
            <template v-else-if="form.link">
              <span class="upload-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="upload-text"><span class="upload-cta">{{ form.link }}</span></span>
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
              <span class="upload-text">Glisser un PDF ici, ou <span class="upload-cta">parcourir</span></span>
              <span class="upload-hint">PDF uniquement</span>
            </template>
          </div>
          <button v-if="form.link" type="button" class="upload-remove"
            @click="form.link = null; linkFile = null; linkUploadedUrl = null; linkFileInput.value = ''">
            ✕ Supprimer le PDF
          </button>
        </div>

        <div class="field field--full">
          <label class="label">Image preview du Calendrier<span class="req">*</span></label>
          <div class="upload-zone" :class="{ 'upload-zone--disabled': loading }" @click="preview_linkFileInput.click()">
            <input ref="preview_linkFileInput" accept="image/*" type="file" name="files" :disabled="loading"
              @change="onPreviewLinkFileSelect" style="display: none" />
            <template v-if="preview_linkUploadedUrl">
              <img :src="preview_linkUploadedUrl" :alt="form.preview_link" class="upload-preview" />
            </template>
            <template v-else-if="form.preview_link">
              <span class="upload-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="upload-text"><span class="upload-cta">{{ form.preview_link }}</span></span>
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
          <button v-if="form.preview_link" type="button" class="upload-remove"
            @click="form.preview_link = null; preview_linkFile = null; preview_linkUploadedUrl = null; preview_linkFileInput.value = ''">
            ✕ Supprimer l'image
          </button>
        </div>
      </div>

      <div class="form-footer">
        <button v-if="showDelete" type="button" class="button delete-btn" @click="$emit('delete')">
          Supprimer le calendrier
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
