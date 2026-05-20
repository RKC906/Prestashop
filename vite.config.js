import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Charge les variables du fichier .env
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
                            resolve: {
                              alias: {
                                '@': fileURLToPath(new URL('./src', import.meta.url))
                              }
                            },
                            server: {
                              proxy: {
                                // Dès que Vue appelle '/api/xyz', Vite prend le relais
                                '/api': {
                                  target: env.VITE_PRESTASHOP_API_URL,
                            changeOrigin: true,
                            // Supprime le préfixe /api si ton PrestaShop a déjà /api dans son URL de base
                            rewrite: (path) => path.replace(/^\/api/, ''),
                            configure: (proxy) => {
                              proxy.on('proxyReq', (proxyReq) => {
                                // PrestaShop utilise l'authentification HTTP Basic avec la clé en nom d'utilisateur (et mot de passe vide)
                                const token = btoa(`${env.VITE_PRESTASHOP_API_KEY}:`)
                                proxyReq.setHeader('Authorization', `Basic ${token}`)
                                // Demande du JSON à PrestaShop (par défaut il renvoie du XML)
                                proxyReq.setHeader('Output-Format', 'JSON')
                              })
                            }
                                }
                              }
                            }
  }
})
