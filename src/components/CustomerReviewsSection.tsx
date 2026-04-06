import { Link } from 'react-router-dom'
import { MessageCircle, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import { ReviewForm } from './ReviewForm'
import type { ProductReview } from '../lib/reviewsStorage'

function StarsRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          fill={n <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
  }).format(new Date(iso))
}

function ReviewCard({ r }: { r: ProductReview }) {
  const initial = r.authorName.trim().charAt(0).toUpperCase() || '?'
  const displayName =
    r.authorName.trim().split(/\s+/).length > 1
      ? `${r.authorName.trim().split(/\s+/)[0]} ${r.authorName.trim().split(/\s+/)[1]?.charAt(0) ?? ''}.`
      : r.authorName.trim() || 'Cliente'

  return (
    <blockquote className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
      <StarsRow rating={r.rating} />
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        &ldquo;{r.comment}&rdquo;
      </p>
      <footer className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-muted font-display text-sm font-bold text-accent"
          aria-hidden
        >
          {initial}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-foreground">{displayName}</p>
          <p className="text-xs text-muted">Compra verificada · {formatReviewDate(r.createdAt)}</p>
        </div>
      </footer>
    </blockquote>
  )
}

export function CustomerReviewsSection() {
  const { user } = useAuth()
  const { reviews, reviewableOrders } = useReviews()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Opiniones de clientes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Reseñas de quienes ya compraron. Cada opinión está ligada a un pedido real
            en tu cuenta.
          </p>
        </div>
        {!user && (
          <Link
            to="/login"
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            Inicia sesión para opinar →
          </Link>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 py-16 text-center">
          <MessageCircle className="h-10 w-10 text-muted" strokeWidth={1.25} />
          <p className="mt-4 max-w-md text-sm text-muted">
            Aún no hay opiniones públicas. Cuando completes un pedido, podrás dejar la
            tuya desde aquí o desde <strong className="text-foreground">Mi cuenta</strong>.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 12).map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>
      )}

      {user && reviewableOrders.length > 0 && (
        <div className="mt-12 border-t border-border pt-10">
          <h3 className="font-display text-lg font-bold">Deja tu opinión</h3>
          <p className="mt-2 text-sm text-muted">
            Tienes {reviewableOrders.length}{' '}
            {reviewableOrders.length === 1 ? 'pedido' : 'pedidos'} sin valorar. Cuéntanos
            cómo fue la camiseta, la calidad y el servicio.
          </p>
          <div className="mt-6 max-w-xl">
            <ReviewForm orders={reviewableOrders} />
          </div>
        </div>
      )}

      {user && reviewableOrders.length === 0 && reviews.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          Ya valoraste tus pedidos actuales. ¡Gracias por tu feedback!
        </p>
      )}
    </section>
  )
}
