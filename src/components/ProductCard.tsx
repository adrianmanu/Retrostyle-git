import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/money'
import { Heart, ShoppingCart } from 'lucide-react'
import type { Product } from '../data/catalogTypes'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { getCategoryLabel } = useCatalog()
  const [colorIdx, setColorIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const color = product.colors[colorIdx] ?? product.colors[0]
  const out = product.stock <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/30 hover:shadow-[0_0_40px_-12px_rgba(168,85,247,0.28)]">
      <Link to={`/producto/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-surface-elevated">
        {product.isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Nuevo
          </span>
        )}
        {out && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold uppercase text-muted">
            Agotado
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
          {getCategoryLabel(product.categoryId)}
        </p>
        <Link to={`/producto/${product.slug}`}>
          <h3 className="mt-1 font-display text-base font-bold tracking-tight transition hover:text-accent sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {product.description}
        </p>
        <p className="mt-2 text-xs text-muted">Stock: {product.stock}</p>

        {error && (
          <p className="mt-2 text-xs text-red-400">{error}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColorIdx(i)}
              className={`h-7 w-7 rounded-full border-2 transition ${
                i === colorIdx
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-border hover:border-muted'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              aria-label={`Color ${c.name}`}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            {product.compareAtPrice != null && (
              <p className="text-xs text-muted line-through">
                {formatMoney(product.compareAtPrice)}
              </p>
            )}
            <p className="font-display text-xl font-bold tabular-nums">
              {formatMoney(product.price)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-accent hover:text-accent"
              aria-label="Añadir a favoritos"
            >
              <Heart className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              disabled={out}
              onClick={() => {
                setError(null)
                const r = addItem(product, color.name)
                if (!r.ok) setError(r.error)
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:text-sm"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={2} />
              Añadir
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
