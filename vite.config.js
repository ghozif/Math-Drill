import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    rollupOptions: {
      // Pisahkan library Firebase ke file sendiri supaya cache browser lebih awet.
      output: { manualChunks: { firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'] } },
    },
    chunkSizeWarningLimit: 700,
  },
  plugins: [
    react(),
    // PWA: bisa "Add to Home Screen" di iPhone/Android dan tetap jalan saat offline.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Math Drill',
        short_name: 'Drill',
        description: 'Latihan hitung cepat: penjumlahan, pengurangan, perkalian, pembagian',
        lang: 'id',
        theme_color: '#0f766e',
        background_color: '#f4f6f5',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Jangan cache halaman login Firebase (/__/auth/...) sebagai fallback SPA.
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
});
