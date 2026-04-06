import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import { ReviewForm } from '../components/ReviewForm'

export function Account() {
  const { user, logout } = useAuth()
  const { reviewableOrders } = useReviews()

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Mi cuenta
      </h1>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">Nombre</p>
        <p className="mt-1 font-medium">{user?.name}</p>
        <p className="mt-6 text-sm text-muted">Email</p>
        <p className="mt-1 font-medium">{user?.email}</p>
        <p className="mt-6 text-sm text-muted">Rol</p>
        <p className="mt-1 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
      </div>

      {reviewableOrders.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold">Valorar una compra</h2>
          <p className="mt-2 text-sm text-muted">
            Tienes pedidos pendientes de opinión. Ayuda a otros con tu experiencia
            (calidad, talla, envío).
          </p>
          <div className="mt-6">
            <ReviewForm orders={reviewableOrders} compact />
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Panel de administración
          </Link>
        )}
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-surface-elevated"
        >
          Cerrar sesión
        </button>
      </div>
      <Link to="/tienda" className="mt-8 inline-block text-sm text-accent hover:underline">
        ← Volver a la tienda
      </Link>
    </div>
  )
}
