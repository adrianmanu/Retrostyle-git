import { loadTransferOrders, type TransferOrder } from './transferOrdersStorage'

const STORAGE_KEY = 'retrostyle-reviews-v1'

export interface ProductReview {
  id: string
  userId: string
  orderId: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export function loadReviews(): ProductReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as ProductReview[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveReviews(list: ProductReview[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** Pedidos del usuario que aún no tienen reseña. */
export function getReviewableOrders(userId: string): TransferOrder[] {
  const orders = loadTransferOrders().filter((o) => o.userId === userId)
  const reviewedOrderIds = new Set(
    loadReviews()
      .filter((r) => r.userId === userId)
      .map((r) => r.orderId),
  )
  return orders.filter((o) => !reviewedOrderIds.has(o.id))
}

export function appendReview(input: {
  userId: string
  orderId: string
  authorName: string
  rating: number
  comment: string
}): { ok: true } | { ok: false; error: string } {
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating))))
  if (!Number.isFinite(rating)) {
    return { ok: false, error: 'Selecciona una valoración de 1 a 5 estrellas.' }
  }
  const trimmed = input.comment.trim()
  if (trimmed.length < 12) {
    return {
      ok: false,
      error: 'Escribe un comentario de al menos 12 caracteres (calidad, talla, envío…).',
    }
  }
  if (trimmed.length > 2000) {
    return { ok: false, error: 'El comentario es demasiado largo.' }
  }

  const orders = loadTransferOrders()
  const order = orders.find(
    (o) => o.id === input.orderId && o.userId === input.userId,
  )
  if (!order) {
    return { ok: false, error: 'No encontramos ese pedido en tu cuenta.' }
  }

  const list = loadReviews()
  if (list.some((r) => r.orderId === input.orderId && r.userId === input.userId)) {
    return { ok: false, error: 'Ya dejaste una opinión para este pedido.' }
  }

  list.push({
    id: crypto.randomUUID(),
    userId: input.userId,
    orderId: input.orderId,
    authorName: input.authorName.trim() || 'Cliente',
    rating,
    comment: trimmed,
    createdAt: new Date().toISOString(),
  })
  saveReviews(list)
  return { ok: true }
}

/** Más recientes primero. */
export function sortedReviewsNewestFirst(): ProductReview[] {
  return [...loadReviews()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
