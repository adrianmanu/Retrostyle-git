import { useEffect, useState } from 'react'
import { Mail, X } from 'lucide-react'

export const CONTACT_EMAIL = 'retrostylev_r@yahoo.com'

interface EmailContactModalProps {
  open: boolean
  onClose: () => void
}

export function EmailContactModal({ open, onClose }: EmailContactModalProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (open) {
      setSubject('')
      setBody('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function openInMailClient() {
    const s = subject.trim()
    const b = body.trim()
    // encodeURIComponent usa %20 para espacios. URLSearchParams usa + y muchos
    // clientes (p. ej. Outlook) muestran el + literal en asunto y cuerpo.
    const parts: string[] = []
    if (s) parts.push(`subject=${encodeURIComponent(s)}`)
    if (b) parts.push(`body=${encodeURIComponent(b)}`)
    const query = parts.join('&')
    const mailto = `mailto:${CONTACT_EMAIL}${query ? `?${query}` : ''}`
    window.location.href = mailto
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl"
        role="dialog"
        aria-modal
        aria-labelledby="email-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted text-accent">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2
                id="email-modal-title"
                className="font-display text-lg font-bold"
              >
                Escribir a Retrostyle
              </h2>
              <p className="text-sm text-muted">{CONTACT_EMAIL}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-surface-elevated hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-muted">
          Escribe el asunto y el mensaje. Al continuar se abrirá tu aplicación de correo
          (Outlook, Gmail en el navegador, Apple Mail, etc.) con los datos rellenados para
          que solo tengas que enviar.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email-modal-subject"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Asunto
            </label>
            <input
              id="email-modal-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Ej.: Consulta sobre talla M"
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="email-modal-body"
              className="text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Mensaje
            </label>
            <textarea
              id="email-modal-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Escribe aquí tu mensaje…"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={openInMailClient}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-accent-hover"
          >
            Abrir correo
          </button>
        </div>
      </div>
    </div>
  )
}
