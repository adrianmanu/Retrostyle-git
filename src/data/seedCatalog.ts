import type { Category, Product } from './catalogTypes'

export const seedCategories: Category[] = [
  { id: 'basics', label: 'Básicas' },
  { id: 'graficas', label: 'Gráficas' },
  { id: 'limited', label: 'Edición limitada' },
]

export const seedProducts: Product[] = [
  {
    id: '1',
    slug: 'boxy-type-black',
    name: 'Boxy Type — Negro',
    price: 32,
    compareAtPrice: 38,
    categoryId: 'basics',
    stock: 45,
    colors: [
      { name: 'Negro', hex: '#18181b' },
      { name: 'Crema', hex: '#f5f5f0' },
      { name: 'Terracota', hex: '#c2410c' },
    ],
    description: 'Corte boxy con hombro caído. Algodón peinado 220 g/m².',
    detail:
      'Pensada para destacar tipografía y silueta. Costuras reforzadas, cuello canalé de doble aguja y etiqueta tejida minimalista.',
    isNew: true,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    slug: 'oversize-spectrum',
    name: 'Spectrum Oversize',
    price: 36,
    categoryId: 'graficas',
    stock: 32,
    colors: [
      { name: 'Gris', hex: '#52525b' },
      { name: 'Blanco roto', hex: '#e4e4e7' },
    ],
    description: 'Print degradado inspirado en feeds analógicos.',
    detail:
      'Tintas ecológicas, tacto suave. Oversize real: hombro ampliado y largo de manga generoso.',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    slug: 'slim-fit-serif',
    name: 'Serif Slim',
    price: 28,
    categoryId: 'basics',
    stock: 60,
    colors: [
      { name: 'Blanco', hex: '#fafafa' },
      { name: 'Marino', hex: '#1e3a5f' },
      { name: 'Negro', hex: '#09090b' },
    ],
    description: 'Slim fit con micro tipografía serif en pecho.',
    detail:
      'Ideal para capas: chaqueta técnica o camisa abierta. Tejido compacto con buena recuperación.',
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    slug: 'retro-grid-limited',
    name: 'Grid 95 — Limited',
    price: 48,
    compareAtPrice: 55,
    categoryId: 'limited',
    stock: 12,
    colors: [{ name: 'Único', hex: '#27272a' }],
    description: 'Serie numerada. Motivo grid y tipografía bitmap.',
    detail:
      'Edición limitada a 200 unidades. Cada pieza lleva número bordado en la costura lateral.',
    isNew: true,
    image:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    slug: 'chrome-type',
    name: 'Chrome Type',
    price: 34,
    categoryId: 'graficas',
    stock: 28,
    colors: [
      { name: 'Negro', hex: '#0a0a0a' },
      { name: 'Verde bosque', hex: '#14532d' },
    ],
    description: 'Efecto metalizado suave, sin brillo excesivo.',
    detail:
      'Acabado que cambia según la luz. Perfecta para looks nocturnos y fotografía.',
    image:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    slug: 'crop-typo',
    name: 'Crop Typo',
    price: 30,
    categoryId: 'basics',
    stock: 40,
    colors: [
      { name: 'Lavanda', hex: '#c4b5fd' },
      { name: 'Negro', hex: '#18181b' },
    ],
    description: 'Crop con mensaje tipográfico en contraste.',
    detail:
      'Largo ajustado a cintura alta. Composición pensada para stories y reels.',
    image:
      'https://images.unsplash.com/photo-1554568218-0f1715e50ea0?auto=format&fit=crop&w=800&q=80',
  },
]
