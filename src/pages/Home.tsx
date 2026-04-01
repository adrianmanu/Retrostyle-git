import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../context/CatalogContext'

export function Home() {
  const { products } = useCatalog()
  const featured = products.slice(0, 4)

  return (
    <>
      <Hero />
      <TrustBar />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Destacados
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Piezas que definen el ADN de Retrostyle: tipografía clara, color con
              intención y cortes listos para el día a día.
            </p>
          </div>
          <Link
            to="/tienda"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            Ver todo →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Hecha para pantalla, pensada para llevar
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Cada diseño parte de una idea: que se lea bien en un móvil y se
                sienta bien en persona. Trabajamos con tejidos de peso medio, buen
                caída y acabados que aguantan lavados sin perder forma.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  'Composición cromática estudiada para redes',
                  'Cortes contemporáneos: boxy, oversize y slim',
                  'Producción en tiradas controladas',
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 aspect-[4/3] overflow-hidden rounded-3xl border border-border lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80"
                alt="Detalle textil y color"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-extrabold sm:text-3xl">
          Lo que dicen quienes ya la llevan
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              name: 'Laura M.',
              text: 'Calidad de camiseta de marca grande, pero con personalidad. El color es tal como en las fotos.',
            },
            {
              name: 'Daniel R.',
              text: 'Envío rápido y embalaje cuidado. La tipografía del print se ve nítida incluso de cerca.',
            },
            {
              name: 'Elena V.',
              text: 'Me encanta el corte boxy. Ya tengo dos y seguiré mirando las novedades.',
            },
          ].map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 font-display text-sm font-bold">{t.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  )
}
