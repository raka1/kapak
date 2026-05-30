import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import purgecss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = loadEnv(mode, process.cwd())

  const apiProxyConfig = {
    target: process.env.VITE_API_URL,
    changeOrigin: true,
    secure: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    rewrite: (path: string) => path.replace(/^\/api\/v1/, ''),
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
      purgecss({
        safelist: [/fade/, /popper/, /nprogress/, /notyf/, /swiper/],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/v1': apiProxyConfig,
      },
    },
  }
})
