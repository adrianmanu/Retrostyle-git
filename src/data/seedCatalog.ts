import type { Category, Product } from './catalogTypes'
import { publicAsset } from '../lib/publicAsset'

export const seedCategories: Category[] = [
  { id: 'basics', label: 'Básicas' },
  { id: 'graficas', label: 'Gráficas' },
  { id: 'limited', label: 'Edición limitada' },
]

export const seedProducts: Product[] = [
  {
    id: '1',
    slug: 'inner-loop',
    name: 'INNER LOOP',
    price: 21.99,
    categoryId: 'limited',
    stock: 45,
    colors: [{ name: 'Negro', hex: '#18181b' }],
    dropLabel: 'Drop: INNER LOOP',
    phrase: 'Stuck inside myself.',
    concept:
      'Una mente atrapada en sí misma. Pensamientos que se repiten, identidades que se fragmentan. No es locura… es conciencia en exceso. Este diseño representa ese momento en el que te miras tanto por dentro que empiezas a desconocerte.',
    description:
      'Corte boxy fit, 280 g, 100% algodón, tecnología tacto al frío, estampado DTF.',
    detail:
      'No todos van a entenderlo. INNER LOOP no es solo un diseño, es un estado mental. Cuando tu mente no se apaga, se repite. Y tú te quedas ahí.',
    extraNote: 'INNER LOOP — Limited Drop. No restock.',
    isNew: true,
    image: publicAsset('imagenes/inner-loop.png'),
  },
  {
    id: '2',
    slug: 'silent-spray',
    name: 'Silent spray',
    price: 21.99,
    categoryId: 'graficas',
    stock: 32,
    colors: [
      { name: 'Gris', hex: '#52525b' },
      { name: 'Blanco roto', hex: '#e4e4e7' },
    ],
    dropLabel: 'Drop: Silent Spray',
    phrase: 'Speak loud without saying a word.',
    concept:
      'Silent Spray representa la expresión urbana silenciosa: el contraste entre lo minimalista al frente y el caos creativo en la espalda. Inspirado en el graffiti callejero, transmite identidad, rebeldía y autenticidad sin necesidad de palabras.',
    description:
      'Corte boxy fit, 280 g, 100% algodón, tecnología tacto al frío, estampado DTF.',
    detail:
      'El frente es minimalista; la espalda lleva el grafiti y el mensaje. Pensada para quienes prefieren que el impacto se vea al girarse.',
    image: publicAsset('imagenes/silent-spray.png'),
  },
  {
    id: '3',
    slug: 'retro-squad-23',
    name: 'Retro Squad 23',
    price: 19.99,
    categoryId: 'basics',
    stock: 60,
    colors: [{ name: 'Negro', hex: '#09090b' }],
    dropLabel: 'Drop: Retro Squad 23',
    phrase: 'Built for the streets. Worn like a legacy.',
    concept:
      'Retro Squad 23 fusiona la estética deportiva clásica con la esencia del streetwear moderno. Inspirado en los jerseys icónicos y la cultura de equipo, este diseño representa identidad, pertenencia y actitud. El número 23 simboliza legado, liderazgo y presencia, mientras que el estilo limpio en negro refuerza una vibra elegante y dominante en la calle. No es solo ropa, es uniforme de quienes juegan en su propia liga.',
    description:
      'Corte boxy fit, 100% poliéster, cuello RIB, sublimación.',
    detail:
      'Jersey streetwear con alma de equipo: el 23 remite a legado y presencia. Acabado en negro para dominar la calle con calma.',
    image: publicAsset('imagenes/retro-squad-23.png'),
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
