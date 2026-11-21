import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Trash2Treasure',
        short_name: 'T2T',
        description: 'App para publicar y encontrar tesoros reciclables',
        theme_color: '#0071e3',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: '/',
        lang: 'es',
        dir: 'ltr',
        categories: ['utilities', 'lifestyle'],
        prefer_related_applications: false,
        related_applications: [],
        launch_handler: {
          client_mode: 'focus-existing'
        },
        handle_links: 'preferred',
        edge_side_panel: {
          preferred_width: 400
        },
        share_target: {
          action: '/add-item',
          method: 'GET',
          enctype: 'application/x-www-form-urlencoded',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Mapa',
            short_name: 'Mapa',
            description: 'Ver tesoros en el mapa',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Publicar',
            short_name: 'Publicar',
            description: 'Publicar un tesoro nuevo',
            url: '/add-item',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Perfil',
            short_name: 'Perfil',
            description: 'Ver mi perfil y puntos',
            url: '/profile',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: 'screenshots/01-mobile-map-mockup.png',
            sizes: '950x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mapa de tesoros cercanos'
          },
          {
            src: 'screenshots/03-mobile-item-detail-mockup.png',
            sizes: '916x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Detalle del tesoro'
          },
          {
            src: 'screenshots/06-mobile-add-item-mockup.png',
            sizes: '929x1920',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Publicar un tesoro'
          },
          {
            src: 'screenshots/01-desktop-map-mockup.png',
            sizes: '1539x905',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Mapa en escritorio'
          },
          {
            src: 'screenshots/05-desktop-add-item-mockup.png',
            sizes: '1541x904',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Publicar en escritorio'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/trash2treasure-3sw4\.onrender\.com\/api\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
