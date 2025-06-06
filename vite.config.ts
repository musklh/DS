// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5371,
    proxy: {  // 使用 Vite 标准 proxy 配置
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },

    }
  },
  preview: {
    port: 5371,  // 设置预览服务器端口
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 配置 '@' 为 'src' 目录
    }
  },

})
