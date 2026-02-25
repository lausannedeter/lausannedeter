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
      const { categories, categoryMap, events, affiches } = useEvents();
      const object = { data: null };
      if (endpoint.endsWith('/events')) object.data= events;
      if (endpoint.endsWith('/categories')) object.data = categories;
      if (endpoint.endsWith('/affiches')) object.data = affiches;
      return object;
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
