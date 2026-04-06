import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ShoppingCart } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../lib/money'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { getProductBySlug, getCategoryLabel } = useCatalog()
  const product = useMemo(
    () => (slug ? getProductBySlug(slug) : undefined),
    [slug, getProductBySlug],
  )
  const [colorIdx, setColorIdx] = useState(0)
  const { addItem } = useCart()
  const [error, setError] = useState<string | null>(null)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold">Producto no encontrado</h1>
        <Link to="/tienda" className="mt-6 inline-block text-accent hover:underline">
          Volver a la tienda
        </Link>
      </div>
    )
  }

  const color = product.colors[colorIdx] ?? product.colors[0]
  const out = product.stock <= 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        to="/tienda"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a la tienda
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover lg:aspect-auto lg:min-h-[560px]"
          />
        </div>

        <div className="flex flex-col">
          {product.isNew && (
            <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-white">
              Nuevo
            </span>
          )}
          {product.dropLabel && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {product.dropLabel}
            </p>
          )}
          <p
            className={`text-xs font-semibold uppercase tracking-widest text-accent ${product.dropLabel ? 'mt-2' : 'mt-3'}`}
          >
            {getCategoryLabel(product.categoryId)}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-muted">Stock disponible: {product.stock}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            {product.compareAtPrice != null && (
              <span className="text-lg text-muted line-through tabular-nums">
                {formatMoney(product.compareAtPrice)}
              </span>
            )}
            <span className="font-display text-3xl font-bold tabular-nums">
              {formatMoney(product.price)}
            </span>
          </div>

          {product.phrase && (
            <blockquote className="mt-8 border-l-2 border-accent pl-4 font-display text-lg font-semibold italic leading-snug text-foreground">
              &ldquo;{product.phrase}&rdquo;
            </blockquote>
          )}

          {product.concept && (
            <p className="mt-6 leading-relaxed text-muted">{product.concept}</p>
          )}

          <div className="mt-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Ficha técnica
            </p>
            <p className="leading-relaxed text-muted">{product.description}</p>
          </div>

          {product.detail.trim() !== product.concept?.trim() && (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Descripción
              </p>
              <p className="leading-relaxed text-muted/90">{product.detail}</p>
            </div>
          )}

          {product.extraNote && (
            <p className="mt-6 rounded-xl border border-accent/30 bg-accent-muted px-4 py-3 text-sm font-medium text-foreground">
              {product.extraNote}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Color
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColorIdx(i)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    i === colorIdx
                      ? 'border-accent bg-accent-muted text-foreground'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-white/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={out}
            onClick={() => {
              setError(null)
              const r = addItem(product, color.name)
              if (!r.ok) setError(r.error)
            }}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-base font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[240px]"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {out ? 'Agotado' : `Añadir al carrito — ${color.name}`}
          </button>

          <ul className="mt-10 space-y-2 border-t border-border pt-8 text-sm text-muted">
            <li>• Algodón peinado o mezcla según modelo — ficha técnica en etiqueta.</li>
            <li>• Lavado máx. 30 °C, del revés, con colores similares.</li>
            <li>• Sin tienda física: envíos desde Ecuador.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
