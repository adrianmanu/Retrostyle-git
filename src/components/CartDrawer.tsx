import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function formatMoney(amount: number, currency: 'EUR' | 'USD') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function CartDrawer() {
  const { getProductById } = useCatalog()
  const {
    lines,
    isOpen,
    closeCart,
    removeLine,
    setQuantity,
    subtotal,
    currency,
    setCurrency,
  } = useCart()
  const { user } = useAuth()
  const [qtyError, setQtyError] = useState<string | null>(null)

  return (
    <>
      <button
        type="button"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold">Carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-surface-elevated"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            Moneda
          </span>
          <div className="flex rounded-full border border-border p-0.5">
            {(['EUR', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  currency === c
                    ? 'bg-accent text-zinc-950'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted">Tu carrito está vacío.</p>
              <Link
                to="/tienda"
                onClick={closeCart}
                className="mt-4 text-sm font-semibold text-accent hover:underline"
              >
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const p = getProductById(line.productId)
                if (!p) return null
                const linePrice = p.price * (currency === 'USD' ? 1.08 : 1)
                return (
                  <li
                    key={line.lineId}
                    className="flex gap-4 rounded-xl border border-border bg-surface p-3"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="h-20 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{line.colorName}</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums">
                        {formatMoney(linePrice, currency)} × {line.quantity}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setQtyError(null)
                            const r = setQuantity(line.lineId, line.quantity - 1)
                            if (!r.ok) setQtyError(r.error)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-surface-elevated"
                          aria-label="Menos"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setQtyError(null)
                            const r = setQuantity(line.lineId, line.quantity + 1)
                            if (!r.ok) setQtyError(r.error)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-surface-elevated"
                          aria-label="Más"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLine(line.lineId)}
                          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {qtyError && (
            <p className="mt-4 text-center text-xs text-red-400">{qtyError}</p>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border bg-surface/80 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-xl font-bold tabular-nums">
                {formatMoney(subtotal, currency)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              Gastos de envío e impuestos calculados al finalizar la compra.
            </p>
            {user ? (
              <Link
                to="/checkout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-hover"
              >
                Finalizar compra
              </Link>
            ) : (
              <Link
                to="/login?redirect=%2Fcheckout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-hover"
              >
                Inicia sesión para comprar
              </Link>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center text-sm font-medium text-muted hover:text-foreground"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
