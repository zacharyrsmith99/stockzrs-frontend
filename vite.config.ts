import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws': {
        target: process.env.STOCKZRS_RELAY_SERVICE_WS_URL,
        ws: true,
      }
    }
  },
  define: {
    'process.env.STOCKZRS_RELAY_SERVICE_WS_URL': JSON.stringify(process.env.STOCKZRS_RELAY_SERVICE_WS_URL)
  }
})