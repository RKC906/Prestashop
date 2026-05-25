import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // Vite va intercepter ceci et le rediriger vers PrestaShop
})

export default api