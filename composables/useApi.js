export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const baseURL = config.public.apiUrl

  const authHeaders = () => ({
    Authorization: `Bearer ${token.value}`
  })

  const get = async (endpoint, options = {}) => {
    try {
      return await $fetch(endpoint, { baseURL, ...options });
    } catch (err) {
      console.warn(`L'API ne repond pas ${endpoint}, fallback vers les JSON`, err);
      const { events, categories, affiches } = useEvents();
      if (endpoint.endsWith('/events')) return events;
      if (endpoint.endsWith('/categories')) return categories;
      if (endpoint.endsWith('/affiches')) return affiches;
      throw err;
    }
  };

  const post = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'POST', body, headers: authHeaders(), ...options })

  const put = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'PUT', body, headers: authHeaders(), ...options })

  const del = (endpoint, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'DELETE', headers: authHeaders(), ...options })

  return { get, post, put, del }
}
