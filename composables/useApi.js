export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const baseURL = config.public.apiUrl

  const authHeaders = () => ({
    Authorization: `Bearer ${token.value}`
  })

  const get = (endpoint, options = {}) =>
    $fetch(endpoint, { baseURL, ...options })

  const post = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'POST', body, headers: authHeaders(), ...options })

  const put = (endpoint, body, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'PUT', body, headers: authHeaders(), ...options })

  const del = (endpoint, options = {}) =>
    $fetch(endpoint, { baseURL, method: 'DELETE', headers: authHeaders(), ...options })

  return { get, post, put, del }
}
