import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { ProductCard } from '../components/ProductCard'
import { CustomerReviewsSection } from '../components/CustomerReviewsSection'
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
              Piezas que definen el ADN de Retrostyle: color con intención y cortes
              listos para el día a día.
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
              <p className="leading-relaxed text-muted">
                En Retrostyle no solo usas ropa, eres parte de la identidad.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Diseños únicos y cortes chéveres hechos para que destaques y luzcas
                con actitud en la calle.
              </p>
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

      <CustomerReviewsSection />
    </>
  )
}
