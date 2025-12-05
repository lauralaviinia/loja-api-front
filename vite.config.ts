import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona chamadas iniciadas com /api para o backend em localhost:3000
      // e remove o prefixo /api antes de enviar. Ajuste o target se necessário.
      '/api': {
        target: 'https://loja-api-back.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
