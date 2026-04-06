import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { login, user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirect = searchParams.get('redirect') || '/'
  const safeRedirect = redirect.startsWith('/') ? redirect : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(safeRedirect, { replace: true })
  }, [user, navigate, safeRedirect])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const r = await login(email, password)
    setLoading(false)
    if (!r.ok) {
      setError(r.error ?? 'Error al iniciar sesión.')
      return
    }
    navigate(safeRedirect, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-muted">
        Necesitas una cuenta para finalizar la compra.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-muted">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-muted">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        ¿No tienes cuenta?{' '}
        <Link
          to={`/registro?redirect=${encodeURIComponent(redirect)}`}
          className="font-semibold text-accent hover:underline"
        >
          Regístrate
        </Link>
      </p>

      <p className="mt-8 rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted">
        <strong className="text-foreground">Demo administrador:</strong>{' '}
        <code className="text-accent">admin@retrostyle.local</code> · contraseña{' '}
        <code className="text-accent">RetroAdmin2026</code>
      </p>
    </div>
  )
}
