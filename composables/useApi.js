export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const baseURL = config.public.apiUrl

  const authHeaders = () => ({
    Authorization: `Bearer ${token.value}`
  })

  const getFallback = (endpoint) => {
    const { categories, events, affiches } = useEvents()
    const object = { data: null }
    if (endpoint.endsWith('/events')) object.data = events
    if (endpoint.endsWith('/categories')) object.data = categories
    if (endpoint.endsWith('/affiches')) object.data = affiches
    return object
  }

  const get = async (endpoint, options = {}) => {
    const isPrerender = import.meta.prerender || !baseURL || baseURL.includes('localhost')
    if (isPrerender) {
      console.warn(`Prerender/baseURL manquant → fallback JSON pour ${endpoint}`)
      return getFallback(endpoint)
    }
    try {
      return await $fetch(endpoint, { baseURL, ...options })
    } catch (err) {
      console.warn(`L'API ne repond pas ${endpoint} → fallback JSON`, err)
      return getFallback(endpoint)
    }
  }

  const post = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'POST', body, headers: authHeaders(), ...options })

  const put = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'PUT', body, headers: authHeaders(), ...options })

  const del = (endpoint, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'DELETE', headers: authHeaders(), ...options })

  return { get, post, put, del }
}
