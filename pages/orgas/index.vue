<script setup>
const form = reactive({ name: "", email: "", description: "", url: "" });
const status = ref(null);
const errorMessage = ref("");
const api = useApi();

async function handleRegister() {
  status.value = "loading";
  errorMessage.value = "";
  try {
    await api.post("/organisations/register", {
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
  <section class="org-page">

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
        <div class="why-card">
          <span class="why-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Pixelarticons by Gerrit Halfmann - https://github.com/halfmage/pixelarticons/blob/master/LICENSE --><path fill="currentColor" d="M15 2h2v2h4v18H3V4h4V2h2v2h6zM9 6H5v2h14V6zm-4 4v10h14V10zm2 2h2v2H7zm6 0h-2v2h2zm2 0h2v2h-2zm-6 4H7v2h2zm2 0h2v2h-2zm6 0h-2v2h2z"/></svg></span>
          <p class="why-text">Publie tes évènements directement dans le calendrier romand.</p>
        </div>
        <div class="why-card">
          <span class="why-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Pixelarticons by Gerrit Halfmann - https://github.com/halfmage/pixelarticons/blob/master/LICENSE --><path fill="currentColor" d="M10 2h4v4h-4zM7 7h10v2h-2v13h-2v-6h-2v6H9V9H7zM5 5v2h2V5zm0 0H3V3h2zm14 0v2h-2V5zm0 0V3h2v2z"/></svg></span>
          <p class="why-text">Sois visible auprès des militantexs de toute la région.</p>
        </div>
        <div class="why-card">
          <span class="why-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Pixelarticons by Gerrit Halfmann - https://github.com/halfmage/pixelarticons/blob/master/LICENSE --><path fill="currentColor" d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9zm0 2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4z"/></svg></span>
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
  border-left: 3px solid #ace894;
  padding: 12px 16px;
  background-color: #f7faf6;
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