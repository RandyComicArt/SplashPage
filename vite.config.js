import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The site is served from https://<user>.github.io/SplashPage/, so production
// assets must be requested relative to the /SplashPage/ subpath.
// Local development keeps the simpler "/" base.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SplashPage/' : '/',
  plugins: [react()],
}))
