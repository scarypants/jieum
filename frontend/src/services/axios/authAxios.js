import axios from 'axios'
import store from '@/store'

const authAxios = axios.create()

authAxios.interceptors.request.use((config) => {
    const token = store.state.auth.token || localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default authAxios
