import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(168,85,247,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-accent/[0.07] blur-3xl" />

      {/* Eslogan principal: cuerpo de la página, tipografía grande y llamativa */}
      <div className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <h1 className="font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight text-balance">
            <span className="text-foreground">Retrostyle:</span>
            <br className="sm:hidden" />
            <span className="text-foreground"> La pieza que le faltaba a tu </span>
            <span className="relative inline text-accent [text-shadow:0_0_40px_rgba(168,85,247,0.45)]">
              feed
            </span>
            <span className="text-foreground">.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl lg:mx-0 lg:max-w-lg">
            Camisetas streetwear y diseño retro.
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pb-24">
        <div className="flex flex-col items-center lg:items-start">
          <p className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted">
            Solo online · Ecuador
          </p>
          <div className="mt-8 flex w-full max-w-md flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-glow transition hover:bg-accent-hover sm:text-base"
            >
              Ver colección
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/tienda?cat=limited"
              className="text-sm font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline sm:text-base"
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
