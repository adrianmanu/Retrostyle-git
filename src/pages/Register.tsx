import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { register, user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirect = searchParams.get('redirect') || '/'
  const safeRedirect = redirect.startsWith('/') ? redirect : '/'

  const [name, setName] = useState('')
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
    const r = await register(name, email, password)
    setLoading(false)
    if (!r.ok) {
      setError(r.error ?? 'No se pudo crear la cuenta.')
      return
    }
    navigate(safeRedirect, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-muted">
        Regístrate para guardar tu sesión y completar pedidos.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-muted">
            Nombre
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-muted">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-wider text-muted">
            Contraseña (mín. 8 caracteres)
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? 'Creando cuenta…' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="font-semibold text-accent hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
