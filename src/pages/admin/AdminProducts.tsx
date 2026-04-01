import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Product, ProductColor } from '../../data/catalogTypes'
import { useCatalog } from '../../context/CatalogContext'

function parseColors(text: string): ProductColor[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((s) => s.trim())
      const name = parts[0] || 'Color'
      let hex = parts[1] || '#888888'
      if (!hex.startsWith('#')) hex = `#${hex}`
      return { name, hex }
    })
}

function serializeColors(colors: ProductColor[]): string {
  return colors.map((c) => `${c.name}|${c.hex}`).join('\n')
}

const emptyDraft = (): Omit<Product, 'id' | 'slug'> => ({
  name: '',
  price: 29.9,
  compareAtPrice: undefined,
  categoryId: '',
  stock: 20,
  colors: [{ name: 'Único', hex: '#27272a' }],
  description: '',
  detail: '',
  isNew: false,
  image:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
})

export function AdminProducts() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryLabel,
  } = useCatalog()

  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Omit<Product, 'id' | 'slug'>>(emptyDraft())
  const [colorsText, setColorsText] = useState('Único|#27272a')

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.label}
        </option>
      )),
    [categories],
  )

  function openAdd() {
    const d = emptyDraft()
    if (categories[0]) d.categoryId = categories[0].id
    setDraft(d)
    setColorsText(serializeColors(d.colors))
    setEditId(null)
    setModal('add')
  }

  function openEdit(p: Product) {
    setEditId(p.id)
    const { id: _i, slug: _s, ...rest } = p
    setDraft(rest)
    setColorsText(serializeColors(p.colors))
    setModal('edit')
  }

  function save() {
    const colors = parseColors(colorsText)
    if (colors.length === 0) {
      alert('Define al menos un color (una línea: Nombre|#hex).')
      return
    }
    if (!draft.categoryId) {
      alert('Elige una categoría.')
      return
    }
    const payload = { ...draft, colors }
    if (modal === 'add') {
      addProduct(payload)
    } else if (editId) {
      updateProduct(editId, payload)
    }
    setModal(null)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Productos
          </h1>
          <p className="mt-2 text-muted">
            Precio en €, stock total compartido entre colores en el carrito.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-surface/80 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-3 font-semibold">Nombre</th>
              <th className="px-3 py-3 font-semibold">Categoría</th>
              <th className="px-3 py-3 font-semibold tabular-nums">Precio</th>
              <th className="px-3 py-3 font-semibold tabular-nums">Stock</th>
              <th className="px-3 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-3 font-medium">{p.name}</td>
                <td className="px-3 py-3 text-muted">
                  {getCategoryLabel(p.categoryId)}
                </td>
                <td className="px-3 py-3 tabular-nums">{p.price.toFixed(2)} €</td>
                <td className="px-3 py-3 tabular-nums">{p.stock}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-foreground"
                    aria-label="Editar"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="ml-1 inline-flex rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Eliminar"
                    onClick={() => {
                      if (
                        confirm(
                          `¿Eliminar «${p.name}»? Esta acción no se puede deshacer.`,
                        )
                      )
                        deleteProduct(p.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
            role="dialog"
            aria-modal
          >
            <h2 className="font-display text-xl font-bold">
              {modal === 'add' ? 'Nuevo producto' : 'Editar producto'}
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Nombre
                </label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={draft.price}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        price: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Precio tachado (opcional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={draft.compareAtPrice ?? ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        compareAtPrice:
                          e.target.value === ''
                            ? undefined
                            : Number.parseFloat(e.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={draft.stock}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        stock: Number.parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Categoría
                  </label>
                  <select
                    value={draft.categoryId}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, categoryId: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                  >
                    <option value="">— Elegir —</option>
                    {categoryOptions}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  URL imagen
                </label>
                <input
                  value={draft.image}
                  onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Descripción corta
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Detalle
                </label>
                <textarea
                  value={draft.detail}
                  onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Colores (una por línea: <code>Nombre|#hex</code>)
                </label>
                <textarea
                  value={colorsText}
                  onChange={(e) => setColorsText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-accent"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!draft.isNew}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, isNew: e.target.checked }))
                  }
                />
                Marcar como novedad
              </label>
            </div>
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-accent-hover"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
