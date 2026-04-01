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
  description: string
  detail: string
  isNew?: boolean
  image: string
  stock: number
}
