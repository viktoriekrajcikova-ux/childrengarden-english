import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Odstrani crossorigin atribut z index.html - nutne pro file:// protokol v Android WebView
function removeCrossorigin(): Plugin {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  base: './', // Relativni cesty pro Android WebView
})
