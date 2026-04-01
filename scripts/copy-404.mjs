import { copyFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const indexHtml = join(dist, 'index.html')
const notFound = join(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.error('copy-404: dist/index.html no existe. Ejecuta vite build antes.')
  process.exit(1)
}

copyFileSync(indexHtml, notFound)
console.log('copy-404: dist/404.html creado (necesario para rutas en GitHub Pages).')
