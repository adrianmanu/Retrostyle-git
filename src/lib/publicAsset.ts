/** Rutas bajo `public/` respetando `base` de Vite (p. ej. GitHub Pages). */
export function publicAsset(relativePath: string): string {
  const base = import.meta.env.BASE_URL
  const path = relativePath.replace(/^\//, '')
  return `${base}${path}`
}
