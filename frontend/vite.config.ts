import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    base: '/',
    plugins: [react()],
    preview: {
        port: 5173,
        strictPort: true,
        // Add SPA fallback for production preview
        open: true,
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
        origin: 'http://0.0.0.0:8080',
    },
    build: {
        // Change minify to 'esbuild' or true (which defaults to esbuild)
        minify: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'animation-vendor': [
                        'lottie-react',
                        '@react-spring/web',
                        'motion',
                    ],
                    'ui-vendor': ['@tabler/icons-react', 'react-icons'],
                },
            },
        },
        chunkSizeWarningLimit: 500,
    },
})
