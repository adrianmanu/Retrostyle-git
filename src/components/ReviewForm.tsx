import { useEffect, useState } from 'react'
import { Loader2, Star } from 'lucide-react'
import type { TransferOrder } from '../lib/transferOrdersStorage'
import { useReviews } from '../context/ReviewsContext'

function formatOrderLabel(o: TransferOrder) {
  const d = new Date(o.createdAt)
  const date = d.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const shortId = o.id.slice(0, 8)
  return `${date} · Pedido ${shortId}… · ${formatMoneyUsd(o.subtotal)}`
}

function formatMoneyUsd(n: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

interface ReviewFormProps {
  /** Si hay un solo pedido, se preselecciona. */
  orders: TransferOrder[]
  onSuccess?: () => void
  compact?: boolean
}

export function ReviewForm({ orders, onSuccess, compact }: ReviewFormProps) {
  const { addReview } = useReviews()
  const [orderId, setOrderId] = useState(orders[0]?.id ?? '')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orders.length === 0) return
    if (!orders.some((o) => o.id === orderId)) {
      setOrderId(orders[0].id)
    }
  }, [orders, orderId])

  if (orders.length === 0) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const r = await addReview({ orderId, rating, comment })
      if (r.ok) {
        setComment('')
        setRating(5)
        onSuccess?.()
      } else {
        setError(r.error)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? 'space-y-4'
          : 'rounded-2xl border border-border bg-surface/80 p-6 shadow-inner'
      }
    >
      <div>
        <label
          htmlFor="review-order"
          className="text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Pedido a valorar
        </label>
        <select
          id="review-order"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {formatOrderLabel(o)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Valoración
        </p>
        <div className="mt-2 flex gap-1">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="rounded-lg p-1.5 text-accent transition hover:bg-accent-muted"
              aria-label={`${n} estrellas`}
            >
              <Star
                className="h-7 w-7 sm:h-8 sm:w-8"
                strokeWidth={1.5}
                fill={n <= rating ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Tu opinión (calidad, talla, envío, servicio…)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="Ej.: La tela se siente premium, el estampado nítido y el envío llegó en pocos días."
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publicando…
          </>
        ) : (
          'Publicar opinión'
        )}
      </button>
    </form>
  )
}
