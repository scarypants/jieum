import axios from 'axios';

export const fetchAPI = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const authFetchAPI = axios.create(fetchAPI.defaults)

authFetchAPI.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))
