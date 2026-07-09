import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// リポジトリ名に合わせて変更してください（例: /sougaku-zemi/）
const REPO_NAME = '/sougaku-zemi/'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
