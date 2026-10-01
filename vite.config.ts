import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import { handleSuggestMessageRequest } from './src/ai/handleSuggestMessage'

function geminiApiPlugin(mode: string): Plugin {
  return {
    name: 'gemini-api',
    config() {
      const env = loadEnv(mode, process.cwd(), '')
      if (env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
      }
    },
    configureServer(server) {
      mountSuggestRoute(server)
    },
    configurePreviewServer(server) {
      mountSuggestRoute(server)
    },
  }
}

function mountSuggestRoute(server: { middlewares: ViteDevServer['middlewares'] }) {
  server.middlewares.use((req, res, next) => {
    void handleSuggestMessageRequest(req, res, next)
  })
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), geminiApiPlugin(mode)],
}))
