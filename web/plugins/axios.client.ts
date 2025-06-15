import axios from 'axios'

export default defineNuxtPlugin(() => {
  // Configure Axios defaults
  const config = useRuntimeConfig()
  
  // Set default base URL for API requests
  axios.defaults.baseURL = config.public.apiBaseUrl || 'http://localhost:8080'
  
  // Set default headers
  axios.defaults.headers.common['Accept'] = 'application/json'
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  
  // Add request interceptor for debugging
  axios.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url)
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )
  
  // Add response interceptor for error handling
  axios.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.config.url)
      return response
    },
    (error) => {
      console.error('API Response Error:', error.response?.status, error.config?.url, error.response?.data)
      return Promise.reject(error)
    }
  )
  
  // Provide axios to the Nuxt app
  return {
    provide: {
      axios
    }
  }
})
