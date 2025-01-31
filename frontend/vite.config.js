import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    port : 5000,
    proxy: {
      "/api" : {
        target : "https://twitter-backend-61fc.onrender.com/",
        changeOrigin : true
      }
    }
  }
})
