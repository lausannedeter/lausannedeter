export default defineEventHandler(async () => {
  return $fetch(useRuntimeConfig().apiUrl)
})
