import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Link previews (WhatsApp, Telegram, Viber…) need an absolute image URL.
 * On Vercel the production domain is filled in automatically; you can also
 * set VITE_SITE_URL yourself (e.g. https://byar-lanya.vercel.app).
 */
function siteUrlPlugin(): Plugin {
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : ''
  const siteUrl = (process.env.VITE_SITE_URL || fromVercel).replace(/\/+$/, '')
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
  }
}

export default defineConfig({
  plugins: [react(), siteUrlPlugin()],
  build: {
    target: 'es2020',
  },
})
