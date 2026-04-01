import { NavLink, Outlet, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ArrowLeft,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', end: true, label: 'Resumen', icon: LayoutDashboard },
  { to: '/admin/pedidos', label: 'Pedidos', icon: Truck },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { to: '/admin/productos', label: 'Productos', icon: Package },
]

export function AdminLayout() {
  const { user, logout, ready } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Cargando…</p>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="border-b border-border p-5">
          <Link to="/" className="font-display text-lg font-extrabold">
            Retro<span className="text-accent">style</span>
          </Link>
          <p className="mt-2 truncate text-xs text-muted">Admin · {user?.email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-accent-muted text-accent'
                    : 'text-muted hover:bg-surface-elevated hover:text-foreground',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur lg:hidden">
          <Link to="/admin" className="font-display font-bold">
            Admin
          </Link>
          <Link to="/" className="text-sm text-accent">
            Tienda
          </Link>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
