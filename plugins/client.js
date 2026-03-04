export default defineNuxtPlugin(async () => {
  const user = useState("user")
  if (user.value) return // already set (e.g. just logged in)

  const config = useRuntimeConfig()
  try {
    const res = await $fetch('/api/auth/me', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })
    user.value = res.user ?? null
  } catch {
    user.value = null
  }
})