// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                listings: resolve(__dirname, 'listings/index.html'),
                // listingdetails: resolve(__dirname, 'listings/details.html'),
                profile: resolve(__dirname, 'profile/index.html'),
            },
        },
    },
    test: {
        // environment: 'jsdom'
    }
});
