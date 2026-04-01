import { Package, RefreshCw, ShieldCheck, Truck } from 'lucide-react'

const items = [
  {
    icon: Truck,
    title: 'Envío seguro',
    text: 'Seguimiento y embalaje reforzado en cada pedido.',
  },
  {
    icon: Package,
    title: 'Envío gratis',
    text: 'En compras superiores a 60 € (península).',
  },
  {
    icon: RefreshCw,
    title: 'Cambios',
    text: '14 días para cambiar talla o modelo.',
  },
  {
    icon: ShieldCheck,
    title: 'Pago protegido',
    text: 'Checkout con cifrado y métodos habituales.',
  },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-accent">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
