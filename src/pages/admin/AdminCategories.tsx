import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'

export function AdminCategories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCatalog()
  const [label, setLabel] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Categorías
      </h1>
      <p className="mt-2 text-muted">
        Las categorías agrupan productos en la tienda. No puedes eliminar una categoría
        si aún tiene productos.
      </p>

      {msg && (
        <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {msg}
        </div>
      )}

      <form
        className="mt-8 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!label.trim()) return
          addCategory(label)
          setLabel('')
        }}
      >
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="min-w-[200px] flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Añadir
        </button>
      </form>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface/80 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-muted">{c.id}</td>
                <td className="px-4 py-3">
                  {editing === c.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full max-w-xs rounded-lg border border-border bg-background px-2 py-1"
                      autoFocus
                      onBlur={() => {
                        if (editValue.trim()) updateCategory(c.id, editValue)
                        setEditing(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editValue.trim()) updateCategory(c.id, editValue)
                          setEditing(null)
                        }
                        if (e.key === 'Escape') setEditing(null)
                      }}
                    />
                  ) : (
                    <span>{c.label}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-foreground"
                    aria-label="Editar"
                    onClick={() => {
                      setEditing(c.id)
                      setEditValue(c.label)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="ml-1 inline-flex rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Eliminar"
                    onClick={() => {
                      setMsg(null)
                      const r = deleteCategory(c.id)
                      if (!r.ok) setMsg(r.reason ?? 'No se pudo eliminar.')
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
    </div>
  )
}
