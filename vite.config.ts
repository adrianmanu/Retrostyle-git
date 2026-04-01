import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages (proyecto): la URL es usuario.github.io/NOMBRE-REPO/
// Prioridad: VITE_BASE_PATH (CI/archivo) → GITHUB_REPOSITORY (Actions) → /
function resolveBase(mode: string): string {
  const env = loadEnv(mode, process.cwd(), '')
  const fromShell = process.env.VITE_BASE_PATH?.trim()
  const fromFile = env.VITE_BASE_PATH?.trim()
  const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1]?.trim()
  const fromGh = ghRepo ? `/${ghRepo}/` : ''

  return fromShell || fromFile || fromGh || '/'
}

export default defineConfig(({ mode }) => {
  const base = resolveBase(mode)

  return {
    base,
    plugins: [react(), tailwindcss()],
  }
})
