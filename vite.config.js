import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(),'src/assets/icons/svg')],
      //指定symbolId的格式
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://10.151.110.210:9400',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
