import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Category, Product } from '../data/catalogTypes'
import { seedCategories, seedProducts } from '../data/seedCatalog'
import { slugify } from '../lib/slugify'

const STORAGE_KEY = 'retrostyle-catalog-v1'

interface Persisted {
  categories: Category[]
  products: Product[]
}

function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Persisted
  } catch {
    return null
  }
}

function savePersisted(data: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function initialState(): Persisted {
  const p = loadPersisted()
  if (p?.categories?.length && p?.products?.length) return p
  return { categories: [...seedCategories], products: [...seedProducts] }
}

interface CatalogContextValue {
  categories: Category[]
  products: Product[]
  getCategoryLabel: (id: string) => string
  getProductBySlug: (slug: string) => Product | undefined
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (categoryId: string | 'all') => Product[]
  addCategory: (label: string) => Category
  updateCategory: (id: string, label: string) => void
  deleteCategory: (id: string) => { ok: boolean; reason?: string }
  addProduct: (partial: Omit<Product, 'id' | 'slug'> & { name: string }) => Product
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => initialState())

  const persist = useCallback((next: Persisted) => {
    setState(next)
    savePersisted(next)
  }, [])

  const getCategoryLabel = useCallback(
    (id: string) => state.categories.find((c) => c.id === id)?.label ?? id,
    [state.categories],
  )

  const getProductBySlug = useCallback(
    (slug: string) => state.products.find((p) => p.slug === slug),
    [state.products],
  )

  const getProductById = useCallback(
    (id: string) => state.products.find((p) => p.id === id),
    [state.products],
  )

  const getProductsByCategory = useCallback(
    (categoryId: string | 'all') => {
      if (categoryId === 'all') return state.products
      return state.products.filter((p) => p.categoryId === categoryId)
    },
    [state.products],
  )

  const addCategory = useCallback(
    (label: string) => {
      const id = `c-${crypto.randomUUID().slice(0, 8)}`
      const cat: Category = { id, label: label.trim() }
      persist({ ...state, categories: [...state.categories, cat] })
      return cat
    },
    [state, persist],
  )

  const updateCategory = useCallback(
    (id: string, label: string) => {
      persist({
        ...state,
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, label: label.trim() } : c,
        ),
      })
    },
    [state, persist],
  )

  const deleteCategory = useCallback(
    (id: string) => {
      const inUse = state.products.some((p) => p.categoryId === id)
      if (inUse) {
        return {
          ok: false,
          reason: 'Hay productos en esta categoría. Reasígnalos o elimínalos antes.',
        }
      }
      persist({
        ...state,
        categories: state.categories.filter((c) => c.id !== id),
      })
      return { ok: true }
    },
    [state, persist],
  )

  const addProduct = useCallback(
    (partial: Omit<Product, 'id' | 'slug'> & { name: string }) => {
      const base = slugify(partial.name)
      let slug = base
      let n = 0
      while (state.products.some((p) => p.slug === slug)) {
        n += 1
        slug = `${base}-${n}`
      }
      const product: Product = {
        ...partial,
        id: crypto.randomUUID(),
        slug,
        stock: Math.max(0, partial.stock),
        price: partial.price,
      }
      persist({ ...state, products: [...state.products, product] })
      return product
    },
    [state, persist],
  )

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      persist({
        ...state,
        products: state.products.map((p) => {
          if (p.id !== id) return p
          const next = { ...p, ...patch }
          if (patch.name != null && patch.name !== p.name) {
            const base = slugify(patch.name)
            let slug = base
            let n = 0
            while (
              state.products.some((o) => o.id !== id && o.slug === slug)
            ) {
              n += 1
              slug = `${base}-${n}`
            }
            next.slug = slug
          }
          if (patch.stock != null) next.stock = Math.max(0, patch.stock)
          return next
        }),
      })
    },
    [state, persist],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      persist({
        ...state,
        products: state.products.filter((p) => p.id !== id),
      })
    },
    [state, persist],
  )

  const value = useMemo(
    () => ({
      categories: state.categories,
      products: state.products,
      getCategoryLabel,
      getProductBySlug,
      getProductById,
      getProductsByCategory,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      state,
      getCategoryLabel,
      getProductBySlug,
      getProductById,
      getProductsByCategory,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
    ],
  )

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
