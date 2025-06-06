import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React関連のライブラリを分離
          react: ['react', 'react-dom'],
          // Rechartsを分離（グラフライブラリ）
          charts: ['recharts'],
          // Lodashを分離（ユーティリティライブラリ）
          utils: ['lodash'],
        }
      }
    },
    // チャンクサイズ警告の上限を調整
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5174,
    host: true,
  },
})
