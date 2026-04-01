import { useCallback, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Package,
  Truck,
} from 'lucide-react'
import {
  loadTransferOrders,
  openComprobanteInNewTab,
  updateOrderDeliveryStatus,
  type DeliveryStatus,
  type TransferOrder,
} from '../../lib/transferOrdersStorage'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function AdminPedidos() {
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const orders = useMemo(() => {
    void version
    return loadTransferOrders().sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [version])

  const [filter, setFilter] = useState<'all' | DeliveryStatus>('all')
  const filtered = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((o) => o.deliveryStatus === filter)
  }, [orders, filter])

  const pendingCount = orders.filter((o) => o.deliveryStatus === 'pending').length

  const [openId, setOpenId] = useState<string | null>(null)

  function setStatus(id: string, status: DeliveryStatus) {
    updateOrderDeliveryStatus(id, status)
    refresh()
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Pedidos por transferencia
          </h1>
          <p className="mt-2 text-muted">
            Revisa qué enviar y marca el pedido como entregado cuando lo hayas enviado al
            cliente.
          </p>
          <p className="mt-2 text-sm text-accent">
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''} de entrega
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ['all', 'Todos'],
            ['pending', 'Pendiente'],
            ['delivered', 'Entregado'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === id
                ? 'bg-accent text-zinc-950'
                : 'border border-border bg-surface text-muted hover:border-accent/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          No hay pedidos en esta vista.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={openId === order.id}
              onToggle={() =>
                setOpenId((id) => (id === order.id ? null : order.id))
              }
              onOpenComprobante={() => openComprobanteInNewTab(order)}
              onSetStatus={setStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onOpenComprobante,
  onSetStatus,
}: {
  order: TransferOrder
  expanded: boolean
  onToggle: () => void
  onOpenComprobante: () => void
  onSetStatus: (id: string, s: DeliveryStatus) => void
}) {
  const isPending = order.deliveryStatus === 'pending'
  const addrShort = `${order.addressLine.slice(0, 42)}${order.addressLine.length > 42 ? '…' : ''}`

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted">{order.id.slice(0, 8)}…</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                isPending
                  ? 'bg-amber-500/20 text-amber-200'
                  : 'bg-emerald-500/20 text-emerald-200'
              }`}
            >
              {isPending ? 'Pendiente' : 'Entregado'}
            </span>
          </div>
          <p className="mt-1 font-medium">{order.email}</p>
          <p className="mt-0.5 text-sm text-muted">{formatDate(order.createdAt)}</p>
          <p className="mt-2 text-sm text-muted">{addrShort}</p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <p className="font-display text-lg font-bold tabular-nums">
            {formatMoney(order.subtotal, order.currency)}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-elevated"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> Detalle
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenComprobante}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-elevated"
            >
              <Eye className="h-3.5 w-3.5" />
              Comprobante
            </button>
            {isPending ? (
              <button
                type="button"
                onClick={() => onSetStatus(order.id, 'delivered')}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <Truck className="h-3.5 w-3.5" />
                Marcar entregado
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSetStatus(order.id, 'pending')}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-elevated"
              >
                Volver a pendiente
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-background/40 px-4 py-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Envío
              </h3>
              <p className="mt-2 whitespace-pre-wrap">{order.addressLine}</p>
              <p className="mt-1">{order.cityPostal}</p>
              {!isPending && order.deliveredAt && (
                <p className="mt-3 text-xs text-emerald-400/90">
                  Marcado entregado: {formatDate(order.deliveredAt)}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Líneas
              </h3>
              <ul className="mt-2 space-y-2">
                {order.lines.map((line, idx) => (
                  <li
                    key={`${order.id}-${idx}-${line.productId}-${line.colorName}`}
                    className="flex justify-between gap-2"
                  >
                    <span>
                      <Package className="mr-1 inline h-3.5 w-3.5 text-muted" />
                      {line.name} · {line.colorName} × {line.quantity}
                    </span>
                    <span className="tabular-nums text-muted">
                      {(line.unitPrice * line.quantity).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
