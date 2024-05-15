// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/Auction-House-SP2-CA/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                listing: resolve(__dirname, 'feed/index.html'),
                profile: resolve(__dirname, 'profile/index.html')
            },
        },
    },
    test: {
        // environment: 'jsdom'
    }
});
