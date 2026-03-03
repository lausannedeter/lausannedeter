<script setup>
const api = useApi();
const router = useRouter();

const form = reactive({ email: "", password: "" });
const status = ref(null); // null | 'loading' | 'error'
const errorMessage = ref("");

async function handleLogin() {
  status.value = "loading"
  errorMessage.value = ""
  try {
    const res = await api.post("/api/auth/login", {
      email: form.email,
      password: form.password,
    })
    const user = useState("user")
    user.value = res.data ?? { email: form.email }
    await router.push("/orgas/dashboard")
  } catch (err) {
    status.value = "error"
    errorMessage.value = err?.data?.message ?? "Identifiants incorrects. Réessaie."
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-card">
      <div class="title-block">
        <div class="title-main">
          <h2 class="title">Connexion</h2>
        </div>
        <div class="title-sub"></div>
      </div>

      <p class="login-hint">
        Accède à ton espace organisation pour gérer tes évènements.
      </p>

      <Transition name="fade">
        <div v-if="status === 'error'" class="banner banner--error">
          ✗ {{ errorMessage }}
        </div>
      </Transition>

      <form class="login-form" @submit.prevent="handleLogin" novalidate>
        <div class="field">
          <label class="label" for="email"
            >Email <span class="req">*</span></label
          >
          <input
            id="email"
            v-model="form.email"
            class="input"
            type="email"
            placeholder="collectif@example.org"
            required
            @input="status = null"
          />
        </div>

        <div class="field">
          <label class="label" for="password"
            >Mot de passe <span class="req">*</span></label
          >
          <input
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            placeholder="••••••••"
            required
            @input="status = null"
          />
        </div>

        <div class="form-footer">
          <nuxt-link class="forgot-link" to="/mot-de-passe-oublie">
            Mot de passe oublié ?
          </nuxt-link>
          <button
            class="button submit-btn"
            type="submit"
            :disabled="status === 'loading'"
          >
            <span v-if="status === 'loading'" class="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
            <span v-else>Se connecter</span>
          </button>
        </div>
      </form>

      <div class="login-divider"></div>

      <p class="register-hint">
        Pas encore de compte ?
        <nuxt-link class="register-link" to="/orgas">
          Rejoindre l'agenda →
        </nuxt-link>
      </p>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 100px);
}

.login-card {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title-block {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 320px;
}

.title-main {
  background-color: #52bfea;
  padding: 10px 20px;
}

.title {
  font-size: 28px;
}

.title-sub {
  background-color: #90e0f3;
  height: 14px;
  width: calc(100% - 20px);
}

.login-hint {
  font-size: 13px;
  line-height: 1.6;
  color: #444;
}

.banner--error {
  background-color: #f5c6be;
  color: #7a1a0a;
  padding: 10px 16px;
  font-family: "Azeret Medium";
  font-size: 12px;
}

.login-form {
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

.req {
  color: #cd523c;
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

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 4px;
}

.forgot-link {
  font-size: 11px;
  color: #888;
  text-decoration: underline;
  font-family: "Azeret Thin Italic";
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

.login-divider {
  height: 1px;
  background-color: #e0e0e0;
}

.register-hint {
  font-size: 12px;
  color: #555;
}

.register-link {
  font-family: "Azeret Medium";
  color: #cd523c;
  text-decoration: underline;
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
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
