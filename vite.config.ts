import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5151',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  },
  app: {
    head: {
      title: "TrueFin - Installment Tracker",
      meta: [
        { name: "description", content: "TrueFin helps manage installments, borrowers, collections, financial tracking and reports efficiently." },
        { property: "og:title", content: "TrueFin - Installment Tracker" },
        { property: "og:description", content: "TrueFin helps manage installments, borrowers, collections, financial tracking and reports efficiently." },
        { property: "og:image", content: "/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    },
  },
})