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
            '/api': 'http://localhost:8001',
            '/media': 'http://localhost:8001',
        }
    }
})
