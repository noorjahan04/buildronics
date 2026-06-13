import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://buildronics.onrender.com',
        changeOrigin: true,
      },
      // ✅ Proxy /uploads so frontend can load images uploaded to backend
      '/uploads': {
        target: 'https://buildronics.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
