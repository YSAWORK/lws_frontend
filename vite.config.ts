// .vite.config.ts

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), 'src'),
        },
    },
    server: {
        proxy: {
            '/api':  {
                target: 'http://localhost:8002',
                changeOrigin: true
            },
            '/media':  {
                target: 'http://localhost:8002',
                changeOrigin: true
            },
        }
    }
})
