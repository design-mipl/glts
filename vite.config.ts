import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['glts.dev.metaphi.in'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('@tiptap') || id.includes('prosemirror')) {
            return 'tiptap'
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'recharts'
          }
          if (id.includes('@mui/x-date-pickers') || id.includes('@mui/x-')) {
            return 'mui-x'
          }
          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui'
          }
          if (id.includes('react-router')) {
            return 'router'
          }
          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('scheduler')
          ) {
            return 'react-vendor'
          }
          if (id.includes('lucide-react')) {
            return 'lucide'
          }
          return 'vendor'
        },
      },
    },
  },
})
