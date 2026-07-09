import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// リポジトリ名に合わせて変更してください（例: /okd_math_infomatics/）
const REPO_NAME = '/okd_math_infomatics/'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
