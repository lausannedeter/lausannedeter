<script setup>
const form = reactive({ email: "" })
const status = ref(null) // null | 'loading' | 'success' | 'error'
const errorMessage = ref("")
const api = useApi()

async function handleSubmit() {
  status.value = "loading"
  errorMessage.value = ""
  try {
    await api.post("/auth/forgot-password", { email: form.email })
    status.value = "success"
  } catch (err) {
    status.value = "error"
    errorMessage.value = err?.data?.message ?? "Une erreur est survenue. Réessaie."
  }
}
</script>

<template>
  <section class="forgot-page">
    <div class="forgot-card">

      <!-- Title -->
      <div class="title-block">
        <div class="title-main">
          <h2 class="title">Mot de passe oublié</h2>
        </div>
        <div class="title-sub"></div>
      </div>

      <!-- Success state -->
      <Transition name="fade">
        <div v-if="status === 'success'" class="banner banner--success">
          ✓ Si un compte existe pour cette adresse, tu recevras un email sous peu.
        </div>
      </Transition>

      <!-- Error state -->
      <Transition name="fade">
        <div v-if="status === 'error'" class="banner banner--error">
          ✗ {{ errorMessage }}
        </div>
      </Transition>

      <template v-if="status !== 'success'">
        <p class="hint">
          Saisis l'adresse email de ton organisation. On t'enverra un lien pour réinitialiser ton mot de passe.
        </p>

        <form class="forgot-form" @submit.prevent="handleSubmit" novalidate>
          <div class="field">
            <label class="label" for="email">Email <span class="req">*</span></label>
            <input
              id="email"
              v-model="form.email"
              class="input"
              type="email"
              placeholder="contact@collectif.org"
              required
              @input="status = null"
            />
          </div>

          <div class="form-footer">
            <nuxt-link class="back-link" to="/login">← Retour à la connexion</nuxt-link>
            <button
              class="button submit-btn"
              type="submit"
              :disabled="status === 'loading' || !form.email"
            >
              <span v-if="status === 'loading'" class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
              <span v-else>Envoyer le lien</span>
            </button>
          </div>
        </form>
      </template>

      <!-- Post-success action -->
      <Transition name="fade">
        <div v-if="status === 'success'" class="post-success">
          <nuxt-link class="back-link" to="/login">← Retour à la connexion</nuxt-link>
        </div>
      </Transition>

    </div>
  </section>
</template>

<style scoped>
.forgot-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 100px);
}

.forgot-card {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Title block */
.title-block {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 360px;
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

/* Banners */
.banner {
  padding: 12px 16px;
  font-family: "Azeret Medium";
  font-size: 12px;
  line-height: 1.6;
}

.banner--success {
  background-color: #ace894;
  color: #1a4a0a;
}

.banner--error {
  background-color: #f5c6be;
  color: #7a1a0a;
}

/* Hint */
.hint {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
}

/* Form */
.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 4px;
}

.back-link {
  font-size: 11px;
  color: #888;
  font-family: "Azeret Thin Italic";
  text-decoration: underline;
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

.post-success {
  display: flex;
}

/* Loading dots */
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>