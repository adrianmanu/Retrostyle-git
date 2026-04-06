import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AtSign, Mail, MapPin, Phone } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { EmailContactModal, CONTACT_EMAIL } from './EmailContactModal'

export function Footer() {
  const { categories } = useCatalog()
  const [emailOpen, setEmailOpen] = useState(false)

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">
              Retro<span className="text-accent">style</span>
            </p>
            <p className="mt-2 max-w-sm font-display text-sm font-bold leading-snug text-foreground">
              Retrostyle: La pieza que le faltaba a tu <span className="text-accent">feed</span>.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Marca 100% ecuatoriana con diseños únicos estilo streetwear/moderno
              para marcar diferencia.
            </p>
            <a
              href="https://www.instagram.com/retrostylev_r/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent"
            >
              <AtSign className="h-4 w-4" />
              @retrostylev_r
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Comprar
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/tienda" className="hover:text-accent">
                  Toda la tienda
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/tienda?cat=${c.id}`}
                    className="hover:text-accent"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2 text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Ecuador — marca online. Sin tienda física; envíos dentro del país.
              </li>
              <li className="flex flex-col gap-2">
                <a
                  href="tel:+593984847154"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  +593 0984847154
                </a>
                <a
                  href="tel:+593999205886"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  +593 0999205886
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setEmailOpen(true)}
                  className="inline-flex items-center gap-2 text-left hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT_EMAIL}
                </button>
              </li>
            </ul>
            <p className="mt-6 text-xs text-muted">
              L–V · 10:00–18:00 (respuesta por email en 24 h)
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Retrostyle. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <span className="cursor-not-allowed">Aviso legal</span>
            <span className="cursor-not-allowed">Privacidad</span>
            <span className="cursor-not-allowed">Cookies</span>
          </div>
        </div>
      </div>

      <EmailContactModal open={emailOpen} onClose={() => setEmailOpen(false)} />
    </footer>
  )
}
