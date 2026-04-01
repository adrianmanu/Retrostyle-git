import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, ImageIcon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import {
  buildComprobantePayload,
  saveTransferOrder,
  type TransferOrderLine,
} from '../lib/transferOrdersStorage'

function formatMoney(amount: number, currency: 'EUR' | 'USD') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

const MAX_FILE_BYTES = 2.5 * 1024 * 1024

export function Checkout() {
  const { user } = useAuth()
  const { lines, subtotal, currency, clearCart } = useCart()
  const { getProductById } = useCatalog()

  const [email, setEmail] = useState(user?.email ?? '')
  const [addressLine, setAddressLine] = useState('')
  const [cityPostal, setCityPostal] = useState('')
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) setEmail((e) => e || user.email)
  }, [user?.email])

  if (lines.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Carrito vacío</h1>
        <p className="mt-2 text-muted">Añade productos antes de pagar.</p>
        <Link
          to="/tienda"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-zinc-950"
        >
          Ir a la tienda
        </Link>
      </div>
    )
  }

  if (done && completedOrderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold">Pedido recibido</h1>
        <p className="mt-2 font-mono text-sm text-accent">Referencia: {completedOrderId}</p>
        <p className="mt-4 text-muted">
          Hemos guardado tu pedido con el comprobante de transferencia. Conserva el número de
          referencia por si necesitas contactarnos.
        </p>
        <p className="mt-4 text-sm text-muted">
          Gracias, {user?.name}. Te responderemos por correo cuando verifiquemos el pago.
        </p>
        <Link
          to="/tienda"
          className="mt-10 inline-block rounded-full border border-border px-8 py-3 text-sm font-semibold hover:bg-surface"
        >
          Seguir comprando
        </Link>
      </div>
    )
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const f = e.target.files?.[0]
    if (!f) {
      setComprobante(null)
      return
    }
    if (f.size > MAX_FILE_BYTES) {
      setFileError('El archivo no puede superar 2,5 MB.')
      setComprobante(null)
      e.target.value = ''
      return
    }
    const ok =
      f.type.startsWith('image/') ||
      f.type === 'application/pdf' ||
      f.name.toLowerCase().endsWith('.pdf')
    if (!ok) {
      setFileError('Solo se admiten imágenes (JPG, PNG, WebP…) o PDF.')
      setComprobante(null)
      e.target.value = ''
      return
    }
    setComprobante(f)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFileError(null)

    if (!comprobante) {
      setFileError('Adjunta el comprobante de la transferencia (imagen o PDF).')
      return
    }

    setSubmitting(true)
    try {
      const comprobantePayload = await buildComprobantePayload(comprobante)
      const orderLines: TransferOrderLine[] = []
      for (const line of lines) {
        const p = getProductById(line.productId)
        if (!p) continue
        orderLines.push({
          productId: line.productId,
          name: p.name,
          quantity: line.quantity,
          colorName: line.colorName,
          unitPrice: p.price,
        })
      }

      const id = crypto.randomUUID()
      const order = {
        id,
        createdAt: new Date().toISOString(),
        userId: user?.id ?? '',
        email: email.trim(),
        addressLine: addressLine.trim(),
        cityPostal: cityPostal.trim(),
        lines: orderLines,
        subtotal,
        currency,
        comprobante: comprobantePayload,
        deliveryStatus: 'pending' as const,
      }

      saveTransferOrder(order)
      setCompletedOrderId(id)
      clearCart()
      setDone(true)
    } catch (err) {
      if (err instanceof Error && err.message === 'STORAGE_FULL') {
        setFormError(
          'No se pudo guardar el pedido en el navegador (espacio insuficiente). Prueba con un archivo más pequeño.',
        )
      } else {
        setFormError('No se pudo procesar el archivo. Inténtalo de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Finalizar compra
      </h1>
      <p className="mt-2 text-sm text-muted">
        Pago únicamente por <span className="text-foreground">transferencia bancaria</span>.
        Cuenta conectada a tu sesión: <span className="text-foreground">{user?.email}</span>
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted">
          Datos para la transferencia
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Realiza la transferencia por el <strong className="text-foreground">importe exacto</strong>{' '}
          del pedido e indica en el concepto tu email o el número de pedido que recibirás al
          confirmar.
        </p>
        <dl className="mt-4 space-y-2 font-mono text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">Titular</dt>
            <dd className="text-right">Retrostyle S.L. (ejemplo)</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">IBAN</dt>
            <dd className="break-all text-right">ES12 3456 7890 12 1234567890</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted">BIC/SWIFT</dt>
            <dd className="text-right">ABCDEF12XXX</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted">
          Sustituye IBAN y titular por los datos reales de tu negocio antes de publicar en
          producción.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form className="space-y-6 lg:col-span-3" onSubmit={handleSubmit}>
          <h2 className="font-display text-lg font-bold">Datos de envío y contacto</h2>

          {formError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="checkout-email"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Correo electrónico
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-address"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Dirección de envío
            </label>
            <input
              id="checkout-address"
              required
              autoComplete="street-address"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Calle, número, piso, puerta"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-city"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Ciudad y código postal
            </label>
            <input
              id="checkout-city"
              required
              autoComplete="postal-code"
              value={cityPostal}
              onChange={(e) => setCityPostal(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="28001 Madrid"
            />
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-background/50 p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Upload className="h-4 w-4 text-accent" strokeWidth={2} />
              Comprobante de transferencia
            </label>
            <p className="mt-1 text-xs text-muted">
              Sube una captura o el PDF del justificante. Máx. 2,5 MB.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:border-accent/50">
                Elegir archivo
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*,.pdf,application/pdf"
                  onChange={onFileChange}
                />
              </label>
              {comprobante && (
                <span className="flex items-center gap-2 text-sm text-muted">
                  {comprobante.type === 'application/pdf' ? (
                    <FileText className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <ImageIcon className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <span className="max-w-[200px] truncate">{comprobante.name}</span>
                </span>
              )}
            </div>
            {fileError && (
              <p className="mt-3 text-sm text-red-400">{fileError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-hover disabled:opacity-60 lg:w-auto lg:px-10"
          >
            {submitting ? 'Enviando pedido…' : 'Confirmar pedido y comprobante'}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted">
            Resumen
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => {
              const p = getProductById(line.productId)
              if (!p) return null
              return (
                <li key={line.lineId} className="flex justify-between gap-2">
                  <span className="text-muted">
                    {p.name} × {line.quantity}
                  </span>
                  <span className="tabular-nums">
                    {(p.price * line.quantity).toFixed(2)} €
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 flex justify-between border-t border-border pt-4 font-display text-lg font-bold">
            <span>Total a transferir</span>
            <span className="tabular-nums">{formatMoney(subtotal, currency)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
