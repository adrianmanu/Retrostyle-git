import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import type { TransferOrder } from '../lib/transferOrdersStorage'
import {
  appendReview as appendReviewStorage,
  getReviewableOrders,
  sortedReviewsNewestFirst,
  type ProductReview,
} from '../lib/reviewsStorage'

interface ReviewsContextValue {
  reviews: ProductReview[]
  refresh: () => void
  /** Pedidos del usuario actual sin reseña. */
  reviewableOrders: TransferOrder[]
  addReview: (input: {
    orderId: string
    rating: number
    comment: string
  }) => Promise<{ ok: true } | { ok: false; error: string }>
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null)

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const reviews = useMemo(() => {
    void version
    return sortedReviewsNewestFirst()
  }, [version])

  const reviewableOrders = useMemo(() => {
    void version
    if (!user?.id) return []
    return getReviewableOrders(user.id)
  }, [user?.id, version])

  const addReview = useCallback(
    async (input: {
      orderId: string
      rating: number
      comment: string
    }): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!user) {
        return { ok: false, error: 'Inicia sesión para dejar tu opinión.' }
      }
      const result = appendReviewStorage({
        userId: user.id,
        orderId: input.orderId,
        authorName: user.name,
        rating: input.rating,
        comment: input.comment,
      })
      if (result.ok) refresh()
      return result
    },
    [user, refresh],
  )

  const value = useMemo(
    () => ({
      reviews,
      refresh,
      reviewableOrders,
      addReview,
    }),
    [reviews, refresh, reviewableOrders, addReview],
  )

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}
