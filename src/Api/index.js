import axios from 'axios'

// Create an Axios instance with the base URL and default headers
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the appropriate token based on the current path
api.interceptors.request.use((config) => {
  const path = window.location.pathname

  const adminToken = localStorage.getItem('admin_token')
  const consumerToken = localStorage.getItem('consumer_token')

  const token = path.startsWith('/admin') ? adminToken : consumerToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log('PATH:', path)
  console.log('TOKEN USED:', token)
  console.log('AUTH HEADER:', config.headers.Authorization)

  return config
})
