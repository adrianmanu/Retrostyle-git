import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.2),transparent)]" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted">
            Solo online · Ecuador
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Retrostyle: La pieza que le faltaba a tu{' '}
            <span className="text-accent">feed</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Camisetas streetwear y diseño retro.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-accent-hover"
            >
              Ver colección
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/tienda?cat=limited"
              className="text-sm font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Edición limitada
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-2xl lg:aspect-square">
          <img
            src="https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80"
            alt="Camisetas apiladas con estética editorial"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-background/80 p-4 backdrop-blur-md">
            <p className="font-display text-sm font-bold">Nueva temporada</p>
            <p className="mt-1 text-xs text-muted">
              Tipografía grande, siluetas relajadas y colores listos para publicar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
