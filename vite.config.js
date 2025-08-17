// vite.config.js
import {defineConfig} from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react(),
        laravel({
            // Blade’de @vite ile verdiğin iki giriş dosyası
            input: ['resources/globals.scss', 'resources/js/app.jsx'],
            refresh: true,
            favicon: '/public/media/logos/fav.png'
        }),
    ],
})
