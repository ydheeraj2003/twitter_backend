import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/twitter_frontend/',
  server : {
    port : 5000,
    
  },
})

{/* 
  build: {
    // Ensure your API calls are redirected to the live backend during production build
    define: {
      'process.env.VITE_API_URL': process.env.NODE_ENV === 'production'
        ? 'https://twitter-backend-61fc.onrender.com' // Live backend URL for production
        : 'http://localhost:8000', // Local backend URL for development
    },
  },
  
  
  */}


  {/*
    
    proxy: {
      "/api" : {
        target : "https://twitter-backend-61fc.onrender.com",
        changeOrigin : true,
        secure: true
      }
    }
    
  */ }
