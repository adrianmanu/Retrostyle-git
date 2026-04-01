import { Link } from 'react-router-dom'
import { FolderTree, Package, Truck } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { loadTransferOrders } from '../../lib/transferOrdersStorage'

export function AdminDashboard() {
  const { categories, products } = useCatalog()
  const orders = loadTransferOrders()
  const pendingDelivery = orders.filter((o) => o.deliveryStatus === 'pending').length

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Panel de administración
      </h1>
      <p className="mt-2 text-muted">
        Gestiona categorías, productos, precios y stock. Los datos se guardan en este
        navegador (localStorage) — en producción conectarías una API y base de datos.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/pedidos"
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent">
            <Truck className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display font-bold">Pedidos</p>
            <p className="text-sm text-muted">
              {orders.length} total · {pendingDelivery} por entregar
            </p>
          </div>
        </Link>
        <Link
          to="/admin/categorias"
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent">
            <FolderTree className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display font-bold">Categorías</p>
            <p className="text-sm text-muted">{categories.length} activas</p>
          </div>
        </Link>
        <Link
          to="/admin/productos"
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent">
            <Package className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display font-bold">Productos</p>
            <p className="text-sm text-muted">{products.length} en catálogo</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
