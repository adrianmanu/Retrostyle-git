import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-muted">Cargando sesión…</p>
      </div>
    )
  }

  if (!user) {
    const redirect = encodeURIComponent(
      `${location.pathname}${location.search}`,
    )
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <Outlet />
}
