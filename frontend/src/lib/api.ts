import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/backend',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {

    delete config.headers['Content-Type']

  }

  return config

})
