export interface Category {
  id: string
  label: string
}

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  compareAtPrice?: number
  categoryId: string
  colors: ProductColor[]
  /** Texto corto / ficha técnica (tarjeta y ficha). */
  description: string
  /** Descripción larga o historia del producto. */
  detail: string
  /** Ej. «Drop: Retro Squad 23» */
  dropLabel?: string
  /** Frase o claim destacado. */
  phrase?: string
  /** Concepto / narrativa del diseño. */
  concept?: string
  /** Nota extra (ej. limited, sin restock). */
  extraNote?: string
  isNew?: boolean
  image: string
  stock: number
}
