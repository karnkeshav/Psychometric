import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the built assets work under GitHub Pages' project-page
// path (e.g. /Psychometric/) without hardcoding the repo name here; the
// exact GH Pages config is Phase 8 (CI/CD).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
