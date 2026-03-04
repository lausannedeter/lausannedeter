export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const user = useState("user")
  if (user.value) return

  const config = useRuntimeConfig()
  try {
    const res = await $fetch('/api/auth/me', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })
    user.value = res.user ?? null
    if (!user.value) return navigateTo("/login")
  } catch {
    user.value = null
    return navigateTo("/login")
  }
})