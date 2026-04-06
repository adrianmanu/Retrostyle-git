import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/catalogTypes'
import { useCatalog } from './CatalogContext'

export interface CartLine {
  lineId: string
  productId: string
  quantity: number
  colorName: string
}

export type AddItemResult = { ok: true } | { ok: false; error: string }

interface CartContextValue {
  lines: CartLine[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (
    product: Product,
    colorName: string,
    quantity?: number,
  ) => AddItemResult
  removeLine: (lineId: string) => void
  setQuantity: (lineId: string, quantity: number) => AddItemResult
  itemCount: number
  subtotal: number
  /** Moneda fija: USD (Ecuador). */
  currency: Currency
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export type Currency = 'USD'

function makeLineId(productId: string, colorName: string) {
  return `${productId}::${colorName}`
}

function cartQtyForProduct(lines: CartLine[], productId: string): number {
  return lines
    .filter((l) => l.productId === productId)
    .reduce((s, l) => s + l.quantity, 0)
}

function CartProviderInner({ children }: { children: ReactNode }) {
  const { getProductById } = useCatalog()
  const [lines, setLines] = useState<CartLine[]>([])
  const linesRef = useRef(lines)
  linesRef.current = lines

  const [isOpen, setIsOpen] = useState(false)
  const currency: Currency = 'USD'

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const clearCart = useCallback(() => setLines([]), [])

  const addItem = useCallback(
    (product: Product, colorName: string, quantity = 1): AddItemResult => {
      const fresh = getProductById(product.id)
      if (!fresh) return { ok: false, error: 'Producto no disponible.' }
      if (fresh.stock <= 0) return { ok: false, error: 'Producto agotado.' }

      const prev = linesRef.current
      const lineId = makeLineId(fresh.id, colorName)
      const existing = prev.find((l) => l.lineId === lineId)
      const currentLineQty = existing?.quantity ?? 0
      const other = cartQtyForProduct(prev, fresh.id) - currentLineQty
      const newLineQty = currentLineQty + quantity
      if (other + newLineQty > fresh.stock) {
        return {
          ok: false,
          error: `Solo hay ${fresh.stock} unidades en stock para este producto.`,
        }
      }

      if (existing) {
        setLines(
          prev.map((l) =>
            l.lineId === lineId ? { ...l, quantity: l.quantity + quantity } : l,
          ),
        )
      } else {
        setLines([
          ...prev,
          { lineId, productId: fresh.id, quantity, colorName },
        ])
      }
      setIsOpen(true)
      return { ok: true }
    },
    [getProductById],
  )

  const removeLine = useCallback((lineId: string) => {
    setLines((p) => p.filter((l) => l.lineId !== lineId))
  }, [])

  const setQuantity = useCallback(
    (lineId: string, quantity: number): AddItemResult => {
      if (quantity < 1) {
        setLines((p) => p.filter((l) => l.lineId !== lineId))
        return { ok: true }
      }

      const prev = linesRef.current
      const line = prev.find((l) => l.lineId === lineId)
      if (!line) return { ok: true }

      const fresh = getProductById(line.productId)
      if (!fresh) return { ok: false, error: 'Producto no disponible.' }

      const other = cartQtyForProduct(prev, line.productId) - line.quantity
      if (other + quantity > fresh.stock) {
        return {
          ok: false,
          error: `Máximo ${fresh.stock} unidades en stock.`,
        }
      }

      setLines(
        prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
      )
      return { ok: true }
    },
    [getProductById],
  )

  const { itemCount, subtotal } = useMemo(() => {
    let count = 0
    let total = 0
    for (const line of lines) {
      const p = getProductById(line.productId)
      if (!p) continue
      count += line.quantity
      total += p.price * line.quantity
    }
    return { itemCount: count, subtotal: total }
  }, [lines, getProductById])

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeLine,
      setQuantity,
      itemCount,
      subtotal,
      currency,
      clearCart,
    }),
    [
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeLine,
      setQuantity,
      itemCount,
      subtotal,
      currency,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartProviderInner>{children}</CartProviderInner>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
