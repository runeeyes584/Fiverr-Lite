import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // cho phép truy cập từ bên ngoài
    port: 5173,
    cors: true,
    strictPort: true,
    allowedHosts: ['all'],  // cho phép truy cập từ mọi host
  },
})
