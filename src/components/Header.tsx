import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'

export function Header() {
  const { itemCount, openCart } = useCart()
  const { user, logout } = useAuth()
  const { categories } = useCatalog()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const { pathname, search } = useLocation()
  const shopCat = new URLSearchParams(search).get('cat')

  const nav = [
    { to: '/tienda', cat: null as string | null, label: 'Tienda' },
    ...categories.map((c) => ({
      to: `/tienda?cat=${c.id}`,
      cat: c.id,
      label: c.label,
    })),
  ]

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
        >
          Retro<span className="text-accent">style</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(({ to, cat, label }) => {
            const active =
              pathname.startsWith('/tienda') &&
              (cat === null
                ? shopCat == null || shopCat === ''
                : shopCat === cat)
            return (
              <Link
                key={to + label}
                to={to}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent-muted text-accent'
                    : 'text-muted hover:bg-surface-elevated hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-accent/50 hover:bg-accent-muted"
              aria-expanded={userOpen}
              aria-label="Cuenta"
            >
              <User className="h-5 w-5" strokeWidth={1.75} />
            </button>
            {userOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-[55]"
                  aria-label="Cerrar menú cuenta"
                  onClick={() => setUserOpen(false)}
                />
                <div className="absolute right-0 top-full z-[56] mt-2 w-56 rounded-xl border border-border bg-background py-2 shadow-xl">
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-xs text-muted">
                        {user.email}
                      </p>
                      <Link
                        to="/cuenta"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-surface-elevated"
                      >
                        Mi cuenta
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-surface-elevated"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Administración
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-muted hover:bg-surface-elevated"
                      >
                        <LogOut className="h-4 w-4" />
                        Salir
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-elevated"
                      >
                        <LogIn className="h-4 w-4" />
                        Iniciar sesión
                      </Link>
                      <Link
                        to="/registro"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-surface-elevated"
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-accent/50 hover:bg-accent-muted"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-zinc-950">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    {mobileOpen && (
      <div className="fixed inset-0 z-[100] md:hidden">
        <button
          type="button"
          className="absolute inset-0 z-0 bg-black/85 backdrop-blur-md"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className="absolute right-0 top-0 z-10 flex h-full max-h-[100dvh] w-[min(100%,22rem)] flex-col border-l border-border/80 bg-[#0a0a0c] shadow-[-12px_0_40px_rgba(0,0,0,0.55)]"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <div className="flex min-h-[3.75rem] shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-4">
            <span className="font-display text-xl font-bold text-foreground">
              Menú
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 text-foreground hover:bg-surface-elevated"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-6">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={[
                'flex min-h-[3.75rem] shrink-0 items-center rounded-2xl border px-5 py-5 text-lg font-semibold leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition active:scale-[0.99]',
                pathname === '/'
                  ? 'border-accent/50 bg-accent-muted text-accent'
                  : 'border-border/80 bg-surface-elevated text-foreground hover:border-accent/40 hover:bg-surface',
              ].join(' ')}
            >
              Inicio
            </Link>
            <p className="shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Tienda
            </p>
            {nav.map(({ to, cat, label }) => {
              const active =
                pathname.startsWith('/tienda') &&
                (cat === null
                  ? shopCat == null || shopCat === ''
                  : shopCat === cat)
              return (
                <Link
                  key={to + label}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    'flex min-h-[3.75rem] shrink-0 items-center rounded-2xl border px-5 py-5 text-lg font-semibold leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition active:scale-[0.99]',
                    active
                      ? 'border-accent/50 bg-accent-muted text-accent'
                      : 'border-border/80 bg-surface-elevated text-foreground hover:border-accent/35 hover:bg-surface',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    )}
    </>
  )
}
