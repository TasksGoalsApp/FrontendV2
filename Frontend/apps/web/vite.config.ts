import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Honor an assigned PORT (e.g. from the preview harness); fall back to 5173.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
