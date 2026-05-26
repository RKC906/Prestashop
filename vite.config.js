import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Charge les variables du fichier .env
  const env = loadEnv(mode, process.cwd())

  const prestashopApiUrl = env.VITE_PRESTASHOP_API_URL
  const prestashopApiKey = env.VITE_PRESTASHOP_API_KEY

  if (!prestashopApiUrl || !prestashopApiKey) {
    throw new Error(
      'Configuration manquante : définissez VITE_PRESTASHOP_API_URL et VITE_PRESTASHOP_API_KEY dans un fichier .env.'
    )
  }

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
                                  target: prestashopApiUrl,
                            changeOrigin: true,
                            // Conserve le préfixe /api pour accéder à l\'API PrestaShop
                            configure: (proxy) => {
                              proxy.on('proxyReq', (proxyReq) => {
                                // PrestaShop utilise l'authentification HTTP Basic avec la clé en nom d'utilisateur (et mot de passe vide)
                                const token = btoa(`${prestashopApiKey}:`)
                                proxyReq.setHeader('Authorization', `Basic ${token}`)
                                // Demande du JSON à PrestaShop (par défaut il renvoie du XML)
                                proxyReq.setHeader('Output-Format', 'JSON')
                              })
                              proxy.on('proxyRes', (proxyRes, req) => {
                                if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
                                  console.warn(
                                    `[proxy][prestashop] ${req.method} ${req.url} -> ${proxyRes.statusCode}`
                                  )
                                }
                              })
                            }
                                }
                              }
                            }
  }
})
