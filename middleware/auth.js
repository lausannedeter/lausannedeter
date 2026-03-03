export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return 
  
  const user = useState("user");
  if (user.value) return
  console.log("Auth middleware: checking user authentication...");
  console.log("Current user state:", user.value);
  try {
    console.log("Token:", useCookie("token").value);
    const res = await useApi().get("/api/auth/me");
    user.value = res.data?.user ?? null;
    if (!user.value) return navigateTo("/login");
  } catch (err) {
    user.value = null;
    return navigateTo("/login");
  }
});