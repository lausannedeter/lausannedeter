<script setup>
const api = useApi();

// --- State ---
const form = reactive({
  title: "",
  description: "",
  location: "",
  date: "",
  time: "",
  category_id: null,
  url: "",
});

const { data: _categories } = await useAsyncData("categories", () =>
  api.get("/api/categories"),
);
const categories = _categories.value?.data ?? [];
const categoryMap = createCategoryMap(categories);

const status = ref(null); // null | 'loading' | 'success' | 'error'
const errorMessage = ref("");

async function handleSubmit() {
  status.value = "loading";
  errorMessage.value = "";

  try {
    const datetime =
      form.date && form.time
        ? new Date(`${form.date}T${form.time}`).toISOString()
        : form.date
          ? new Date(form.date).toISOString()
          : null;

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      datetime,
      categoryd: form.category_id,
      url: form.url || undefined,
    };

    await api.post("/api/events", payload);
    status.value = "success";

    Object.assign(form, {
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      time: "",
      category: null,
      url: "",
    });
  } catch (err) {
    status.value = "error";
    errorMessage.value =
      err?.data?.message ?? "Une erreur est survenue. Réessaie.";
  }
}

function resetStatus() {
  status.value = null;
}
</script>

<template>
  <section class="form-page">
    <div class="title-container">
      <div class="main-title-container">
        <h2 class="title">Ajouter un évènement</h2>
      </div>
      <div class="title-subblock"></div>
    </div>

    <Transition name="fade">
      <div v-if="status === 'success'" class="banner banner--success">
        ✓ Évènement soumis avec succès !
        <button class="banner-close" @click="resetStatus">×</button>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="status === 'error'" class="banner banner--error">
        ✗ {{ errorMessage }}
        <button class="banner-close" @click="resetStatus">×</button>
      </div>
    </Transition>

    <form class="event-form" @submit.prevent="handleSubmit" novalidate>
      <div class="field">
          <label class="label" for="title"
            >Titre <span class="required">*</span></label
          >
          <input
            id="title"
            v-model="form.title"
            class="input"
            type="text"
            placeholder="Manifestation pour le climat…"
            required
            @input="resetStatus"
        />
      </div>

      <div class="field">
        <label class="label" for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="input textarea"
          rows="4"
          placeholder="Décris l'évènement en quelques lignes…"
          @input="resetStatus"
        ></textarea>
      </div>

      <div class="field-row">
        <div class="field">
            <label class="label" for="date"
              >Date <span class="required">*</span></label
            >
            <input
              id="date"
              v-model="form.date"
              class="input"
              type="date"
              required
              @input="resetStatus"
            />
        </div>

        <div class="field">
          <label class="label" for="time">Heure</label>
          <input
            id="time"
            v-model="form.time"
            class="input"
            type="time"
            @input="resetStatus"
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="location"
          >Lieu <span class="required">*</span></label
        >
        <input
          id="location"
          v-model="form.location"
          class="input"
          type="text"
          placeholder="Place de la Riponne, Lausanne"
          required
          @input="resetStatus"
        />
      </div>

      <div class="field">
        <label class="label" for="category">Catégorie</label>
        <select
          id="category"
          v-model="form.category_id"
          class="input select"
          @change="resetStatus"
        >
          <option :value="null" disabled>
            — Sélectionne une catégorie —
          </option>
          <option
            v-for="cat in categoryMap"
            :key="cat._id"
            :value="cat._id"
          >
            {{ cat.label }}
          </option>
        </select>
      </div>

        <div class="field">
          <label class="label" for="url">Lien (optionnel)</label>
          <input
            id="url"
            v-model="form.url"
            class="input"
            type="url"
            placeholder="https://…"
            @input="resetStatus"
          />
        </div>

        <div class="form-footer">
          <span class="required-note"
            ><span class="required">*</span> champs obligatoires</span
          >
          <button
            class="button submit-btn"
            type="submit"
            :disabled="status === 'loading'"
          >
            <span v-if="status === 'loading'" class="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
            <span v-else>Soumettre l'évènement</span>
          </button>
        </div>
    </form>
  </section>
</template>

<style scoped>
.form-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.title-container {
  width: 70%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-self: flex-end;
}

.main-title-container {
  width: 100%;
  padding: 10px 20px;
  background-color: #cd523c;
}

.main-title-container .title {
  font-size: 28px;
  color: white;
}

.title-subblock {
  background-color: #e8856e;
  width: calc(100% - 20px);
  height: 16px;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  font-family: "Azeret Medium";
  font-size: 13px;
}

.banner--success {
  background-color: #ace894;
  color: #1a4a0a;
}

.banner--error {
  background-color: #f5c6be;
  color: #7a1a0a;
}

.banner-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
  color: inherit;
  font-family: "Azeret Medium";
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.label {
  font-family: "Azeret Medium";
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.required {
  color: #cd523c;
}

.required-note {
  font-size: 11px;
  color: #888;
  align-self: center;
}

.input {
  border: 1px solid #ccc;
  padding: 10px 14px;
  font-family: "Azeret Thin";
  font-size: 13px;
  background-color: #fafafa;
  color: black;
  outline: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
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
  min-height: 90px;
}

.select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 6px;
}

.submit-btn {
  min-width: 220px;
  justify-content: center;
  font-size: 13px;
  padding: 12px 24px;
  transition: opacity 0.2s ease;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* TABLETTE */
@media (min-width: 750px) {
  .field-row {
    flex-direction: row;
  }
}
</style>