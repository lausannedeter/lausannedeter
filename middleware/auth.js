export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user");
  try {
    const res = await useApi().get("/api/auth/me");
    user.value = res.data?.user ?? null;
    if (!user.value) return navigateTo("/login");
  } catch {
    user.value = null;
    return navigateTo("/login");
  }
});
