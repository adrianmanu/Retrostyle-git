export interface TransferOrderLine {
  productId: string
  name: string
  quantity: number
  colorName: string
  unitPrice: number
}

export type DeliveryStatus = 'pending' | 'delivered'

export interface TransferOrder {
  id: string
  createdAt: string
  userId: string
  email: string
  addressLine: string
  cityPostal: string
  lines: TransferOrderLine[]
  subtotal: number
  currency: string
  comprobante: {
    fileName: string
    mimeType: string
    dataBase64: string
  }
  deliveryStatus: DeliveryStatus
  deliveredAt?: string
}

const STORAGE_KEY = 'retrostyle-transfer-orders-v1'

function normalizeOrder(raw: Record<string, unknown>): TransferOrder {
  const deliveryStatus: DeliveryStatus =
    raw.deliveryStatus === 'delivered' ? 'delivered' : 'pending'
  return {
    ...(raw as unknown as TransferOrder),
    deliveryStatus,
    deliveredAt:
      typeof raw.deliveredAt === 'string' ? raw.deliveredAt : undefined,
  }
}

export function loadTransferOrders(): TransferOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as Record<string, unknown>[]
    return list.map((o) => normalizeOrder(o))
  } catch {
    return []
  }
}

export function saveTransferOrder(order: TransferOrder): void {
  try {
    const full: TransferOrder = {
      ...order,
      deliveryStatus: order.deliveryStatus ?? 'pending',
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: TransferOrder[] = raw ? JSON.parse(raw) : []
    list.push(full)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    throw new Error('STORAGE_FULL')
  }
}

export function updateOrderDeliveryStatus(
  id: string,
  status: DeliveryStatus,
): void {
  const list = loadTransferOrders()
  const idx = list.findIndex((o) => o.id === id)
  if (idx < 0) return
  list[idx] = {
    ...list[idx],
    deliveryStatus: status,
    deliveredAt:
      status === 'delivered' ? new Date().toISOString() : undefined,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function base64ToBlob(base64: string, mime: string): Blob {
  const bin = atob(base64)
  const len = bin.length
  const arr = new Uint8Array(len)
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime || 'application/octet-stream' })
}

/** Abre el comprobante en una nueva pestaña (imagen o PDF). */
export function openComprobanteInNewTab(order: TransferOrder): void {
  const blob = base64ToBlob(
    order.comprobante.dataBase64,
    order.comprobante.mimeType,
  )
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank', 'noopener,noreferrer')
  if (w) {
    window.setTimeout(() => URL.revokeObjectURL(url), 120_000)
  } else {
    URL.revokeObjectURL(url)
  }
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const r = reader.result
      if (typeof r !== 'string') {
        reject(new Error('read'))
        return
      }
      const comma = r.indexOf(',')
      resolve(comma >= 0 ? r.slice(comma + 1) : r)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export async function buildComprobantePayload(file: File) {
  const dataBase64 = await readFileAsBase64(file)
  return {
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    dataBase64,
  }
}
