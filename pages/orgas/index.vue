<script setup>
const user = useState("user");
const ready = ref(false)

onMounted(() => {
  if (user.value) {
    navigateTo('/orgas/dashboard', { replace: true })
  } else {
    ready.value = true
  }
})
const form = reactive({ name: "", email: "", description: "", url: "" });
const status = ref(null);
const errorMessage = ref("");
const api = useApi();

async function handleRegister() {
  status.value = "loading";
  errorMessage.value = "";
  try {
    await api.post("/api/orgas/register", {
      name: form.name,
      email: form.email,
      description: form.description,
      url: form.url || undefined,
    });
    status.value = "success";
    Object.assign(form, { name: "", email: "", description: "", url: "" });
  } catch (err) {
    status.value = "error";
    errorMessage.value =
      err?.data?.message ?? "Une erreur est survenue. Réessaie.";
  }
}
</script>

<template>
  <div v-if="!ready" class="redirecting">
    <div class="spinner"></div>
  </div>
  <section v-else class="org-page">

    <div class="hero">
      <div class="title-block">
        <div class="title-main">
          <h2 class="title">Organisations</h2>
        </div>
        <div class="title-sub"></div>
      </div>

      <p class="hero-description">
        Tu fais partie d'un collectif, d'une asso, d'un syndicat ou de toute
        structure qui lutte contre les oppressions ?
        <br /><br />
        <span style="white-space: nowrap;">
            Rejoins <a class="deter">Lausanne Deter</a> et rends tes évènements visibles à toute la région.
        </span>
      </p>
    </div>

    <div class="why-section">
      <h3 class="section-label">Pourquoi rejoindre ?</h3>
      <div class="why-grid">
        <div class="why-card" :style="{ borderLeft: '3px solid #FFBF00', backgroundColor: '#FFF8E1' }">
          <span class="why-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Pixel free icons by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" d="M2.285 10.67h27.43v19.81h1.52V6.1h-1.52v3.04H2.285V6.1H.765v24.38h1.52zm25.91-6.1h1.52V6.1h-1.52ZM2.285 30.48h27.43V32H2.285Z"/><path fill="currentColor" d="M25.145 18.29h-3.05v1.52h-1.52v-1.52h-3.05v1.52h-1.52v3.05h1.52v1.52h1.52v1.52h1.53v1.53h1.52V25.9h1.52v-1.52h1.53v-1.52h1.52v-3.05h-1.52zm-1.53-4.58h1.53v1.53h-1.53Zm-6.09 0h1.52v1.53h-1.52Zm-6.1 12.19h1.53v1.53h-1.53Zm0-6.09h1.53v1.52h-1.53Zm0-6.1h1.53v1.53h-1.53ZM5.335 25.9h1.52v1.53h-1.52Zm0-6.09h1.52v1.52h-1.52Zm0-6.1h1.52v1.53h-1.52Zm3.05-9.14V6.1h1.52V4.57h12.19V6.1h1.52V4.57h4.58V3.05h-4.58V0h-1.52v3.05H9.905V0h-1.52v3.05h-4.57v1.52z"/><path fill="currentColor" d="M2.285 4.57h1.53V6.1h-1.53Z"/></svg>
          </span>
          <p class="why-text">Publie tes évènements directement dans le calendrier romand.</p>
        </div>
        <div class="why-card" :style="{ borderLeft: '3px solid #41CFA9', backgroundColor: '#E0F2F1' }">
          <span class="why-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Pixel free icons by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" d="M2.28 16.765h27.43v10.66h1.53v-13.71h-1.53v1.52h-3.05v-1.52h-1.52v1.52H6.85v-1.52H5.33v1.52H2.28v-1.52H.76v13.71h1.52zm25.91-4.58h1.52v1.53h-1.52Zm-9.15 15.24h10.67v1.53H19.04Zm7.62-16.76h1.53v1.52h-1.53Z"/><path fill="currentColor" d="M17.52 18.285v4.57h1.52v1.52h1.53v1.53h7.62v-7.62Zm9.14 6.09h-1.52v-1.52h-1.52v-1.52h-1.53v-1.53h4.57Zm-1.52-15.23h1.52v1.52h-1.52Zm-1.52 3.04h1.52v1.53h-1.52Zm0-4.57h1.52v1.53h-1.52Zm-1.53 3.05h1.53v1.52h-1.53Zm0-4.57h1.53v1.52h-1.53Zm-1.52 3.05h1.52v1.52h-1.52Zm0-4.57h1.52v1.52h-1.52Zm-1.53 3.04h1.53v1.53h-1.53Zm0-4.57h1.53v1.53h-1.53Zm-1.52 22.86h1.52v1.52h-1.52Zm0-21.33h1.52v3.04h-1.52Zm-3.05 19.8h3.05v1.53h-3.05Zm-1.52 1.53h1.52v1.52h-1.52Zm0-21.33h1.52v3.04h-1.52Zm-9.14 13.71v7.62h7.62v-1.53h1.52v-1.52h1.52v-4.57Zm6.09 3.05H8.38v1.52H6.85v1.52H5.33v-4.57H9.9Zm1.53-13.72h1.52v1.53h-1.52Zm0-4.57h1.52v1.53h-1.52Zm-9.15 24.38h10.67v1.53H2.28ZM9.9 9.145h1.53v1.52H9.9Zm0-4.57h1.53v1.52H9.9Zm-1.52 6.09H9.9v1.52H8.38Zm0-4.57H9.9v1.52H8.38Zm-1.53 6.09h1.53v1.53H6.85Zm0-4.57h1.53v1.53H6.85Zm-1.52 1.53h1.52v1.52H5.33Zm-1.52 1.52h1.52v1.52H3.81Zm-1.53 1.52h1.53v1.53H2.28Z"/></svg>
          </span>
          <p class="why-text">Sois visible auprès des militantexs de toute la région.</p>
        </div>
        <div class="why-card" :style="{ borderLeft: '3px solid #FA41AE', backgroundColor: '#FDE4F2' }">
          <span class="why-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Pixel free icons by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" d="M26.67 27.43h1.52V32h-1.52Zm-1.53-1.52h1.53v1.52h-1.53Zm-1.52 1.52h1.52v1.52h-1.52Zm0-3.05h1.52v1.53h-1.52Zm-1.53 4.57h1.53v1.53h-1.53Zm-1.52-6.09h3.05v1.52h-3.05Zm1.52-12.19h1.53v4.57h-1.53Zm-1.52 19.81h1.52V32h-1.52Zm0-15.24h1.52v1.52h-1.52Zm-1.52-6.1h3.04v1.53h-3.04Zm0 15.24h1.52v1.53h-1.52Zm-1.53-3.05h3.05v1.53h-3.05Zm1.53-4.57h1.52v1.53h-1.52Zm-1.53 9.15h1.53v1.52h-1.53Zm0-7.62h1.53v1.52h-1.53Zm0-7.62h1.53v1.52h-1.53ZM16 27.43h1.52v1.52H16Zm0-7.62h1.52v1.52H16Zm0-7.62h1.52v1.52H16Zm-1.52 9.14H16v1.53h-1.52Zm0-7.62H16v1.53h-1.52Zm-1.53 9.15h1.53v1.52h-1.53Zm0-7.62h1.53v1.52h-1.53Zm-1.52 1.52h1.52v1.53h-1.52Zm0-4.57h1.52v3.05h-1.52Zm-1.53 6.1h1.53v1.52H9.9ZM9.9 0v1.52H8.38v3.05H9.9V6.1h1.53v1.52h1.52v1.52h1.53V7.62H16V6.1h1.52V4.57h1.53V1.52h-1.53V0h-3.04v1.52h-1.53V0zM6.86 10.67h4.57v1.52H6.86Zm1.52 6.09H6.86v6.1h1.52v-1.53H9.9v-1.52H8.38zm-3.05 6.1h1.53v1.52H5.33Zm0-10.67h1.53v4.57H5.33ZM3.81 24.38h1.52V32H3.81Z"/></svg>
          </span>
          <p class="why-text">Converge avec d'autres luttes. Soyons solidaires.</p>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="register-section">
      <h3 class="section-label">Demande d'accès</h3>
      <p class="register-hint">
        Remplis ce formulaire pour obtenir un espace organisation. On te
        recontacte par email.
      </p>

      <Transition name="fade">
        <div v-if="status === 'success'" class="banner banner--success">
          ✓ Demande envoyée ! On te recontacte bientôt.
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="status === 'error'" class="banner banner--error">
          ✗ {{ errorMessage }}
        </div>
      </Transition>

      <form class="register-form" @submit.prevent="handleRegister" novalidate>

        <div class="field">
          <label class="label" for="org-name">Nom de l'organisation <span class="req">*</span></label>
          <input
            id="org-name"
            v-model="form.name"
            class="input"
            type="text"
            placeholder="Collectif XYZ"
            required
            @input="status = null"
          />
        </div>

        <div class="field">
          <label class="label" for="org-email">Email de contact <span class="req">*</span></label>
          <input
            id="org-email"
            v-model="form.email"
            class="input"
            type="email"
            placeholder="contact@collectif.org"
            required
            @input="status = null"
          />
        </div>

        <div class="field">
          <label class="label" for="org-desc">Présentation rapide <span class="req">*</span></label>
          <textarea
            id="org-desc"
            v-model="form.description"
            class="input textarea"
            rows="3"
            placeholder="Qui êtes-vous ? Quelles luttes portez-vous ?"
            required
            @input="status = null"
          ></textarea>
        </div>

        <div class="field">
          <label class="label" for="org-url">Site ou réseau social (optionnel)</label>
          <input
            id="org-url"
            v-model="form.url"
            class="input"
            type="url"
            placeholder="https://…"
            @input="status = null"
          />
        </div>

        <div class="form-footer">
          <span class="req-note"><span class="req">*</span> champs obligatoires</span>
          <button
            class="button submit-btn"
            type="submit"
            :disabled="status === 'loading' || status === 'success'"
          >
            <span v-if="status === 'loading'" class="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
            <span v-else>Envoyer la demande</span>
          </button>
        </div>

      </form>

      <p class="login-redirect">
        Déjà un compte ?
        <nuxt-link class="login-link" to="/login">Se connecter →</nuxt-link>
      </p>
    </div>

  </section>
</template>

<style scoped>
a.deter {
    display: flex;
    gap: 10px;
    align-items: center;
    font-family: "Jacquard12";
    font-weight: 100;
    font-size: 24px;
    display: inline;
    white-space: nowrap;
}
.org-page {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title-block {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 420px;
  align-self: flex-end;
  align-items: flex-end;
}

.title-main {
  background-color: #a8ba9a;
  padding: 10px 20px;
  width: 100%;
  text-align: end;
}

.title { font-size: 30px; }

.title-sub {
  background-color: #ace894;
  height: 16px;
  width: calc(100% - 20px);
}

.hero-description {
  font-size: 14px;
  line-height: 1.75;
  color: #333;
}

.why-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-label {
  font-family: "Azeret Medium";
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  font-weight: normal;
}

.why-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.why-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  /* border-left: 3px solid #ace894; */
  padding: 12px 16px;
  /* background-color: #f7faf6; */
}

.why-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.why-text {
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
}

.register-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-hint {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
}

.banner {
  padding: 10px 16px;
  font-family: "Azeret Medium";
  font-size: 12px;
}

.banner--success {
  background-color: #ace894;
  color: #1a4a0a;
}

.banner--error {
  background-color: #f5c6be;
  color: #7a1a0a;
}

.register-form {
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
.req-note { font-size: 11px; color: #888; }

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
  border-color: #a8ba9a;
  background-color: #f7faf6;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 4px;
}

.submit-btn {
  min-width: 200px;
  justify-content: center;
  font-size: 13px;
  padding: 12px 24px;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.redirecting {
  min-height: 60svh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #CD523C;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-redirect {
  font-size: 12px;
  color: #555;
}

.login-link {
  font-family: "Azeret Medium";
  color: #CD523C;
  text-decoration: underline;
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Tablet */
@media (min-width: 750px) {
  .why-grid {
    flex-direction: row;
  }
  .why-card {
    flex: 1;
    flex-direction: column;
  }
}
</style>
