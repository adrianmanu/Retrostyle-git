import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../context/CatalogContext'

export function Shop() {
  const [params, setParams] = useSearchParams()
  const { categories, getProductsByCategory, getCategoryLabel } = useCatalog()

  const catParam = params.get('cat')
  const categoryIds = useMemo(
    () => new Set(['all', ...categories.map((c) => c.id)]),
    [categories],
  )

  const active =
    catParam && categoryIds.has(catParam) ? catParam : 'all'

  const list = useMemo(
    () =>
      active === 'all'
        ? getProductsByCategory('all')
        : getProductsByCategory(active),
    [active, getProductsByCategory],
  )

  const filterButtons = [
    { id: 'all' as const, label: 'Todo' },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tienda
        </h1>
        <p className="mt-3 text-muted">
          Camisetas seleccionadas por categoría. Filtra y elige color antes de
          añadir al carrito.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {filterButtons.map(({ id, label }) => (
          <button
            key={String(id)}
            type="button"
            onClick={() => {
              if (id === 'all') setParams({})
              else setParams({ cat: id })
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === id
                ? 'bg-accent text-white'
                : 'border border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        {list.length} producto{list.length !== 1 ? 's' : ''}
        {active !== 'all' && (
          <>
            {' '}
            en <span className="text-foreground">{getCategoryLabel(active)}</span>
          </>
        )}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
