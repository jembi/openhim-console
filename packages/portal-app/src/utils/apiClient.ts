import axios from 'axios'

const API_URL = 'https://localhost:8080/'

const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export default apiClient
