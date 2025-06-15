// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //安全检查  可选
    // eslintPlugin({
    //   include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.js'], // Specify files to lint
    //   cache: false, // Disable cache to ensure it picks up ESLint config changes
    // }),
  ],
  server: {
    port: 5371,
    proxy: {
      // 开发环境代理配置
      '/api': {
        target: process.env.VITE_API_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5371, // 设置预览服务器端口
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 配置 '@' 为 'src' 目录
    },
  },
});
